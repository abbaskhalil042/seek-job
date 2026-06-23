import { env } from '../config/env';
import { logger } from '../config/logger';
import { ParsedResume } from '../types';
import { heuristicParseResume } from './heuristicParser';

/**
 * Provider-agnostic LLM client used for resume parsing and job matching.
 *
 * Supported providers (all have a free tier):
 *   - gemini      → Google Generative Language API
 *   - groq        → OpenAI-compatible Chat Completions
 *   - openrouter  → OpenAI-compatible Chat Completions
 *
 * When no API key is configured (env.llmEnabled === false) every method
 * gracefully falls back to deterministic heuristics so the platform still
 * works end-to-end out of the box.
 */

const PROVIDER_DEFAULT_MODEL: Record<string, string> = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'meta-llama/llama-3.1-8b-instruct:free',
};

const REQUEST_TIMEOUT_MS = 30000;

interface MatchResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
}

class LLMService {
  private get model(): string {
    return env.LLM_MODEL || PROVIDER_DEFAULT_MODEL[env.LLM_PROVIDER] || 'gemini-2.0-flash';
  }

  get isEnabled(): boolean {
    return env.llmEnabled;
  }

  /**
   * Parse raw resume text into a structured object. Falls back to the
   * heuristic parser when the LLM is unavailable or returns garbage.
   */
  async parseResume(rawText: string): Promise<{ parsed: ParsedResume; parsedBy: 'llm' | 'heuristic' }> {
    if (!this.isEnabled) {
      return { parsed: heuristicParseResume(rawText), parsedBy: 'heuristic' };
    }

    const system =
      'You are an expert resume parser. Extract structured information from the resume text. ' +
      'Respond with ONLY a valid JSON object, no markdown, no commentary.';

    const prompt = `Extract the following fields from the resume below and return strict JSON matching this TypeScript type:
{
  "fullName": string | null,
  "email": string | null,
  "phone": string | null,
  "location": string | null,
  "summary": string | null,
  "skills": string[],
  "totalExperienceYears": number | null,
  "education": { "degree": string, "institution": string, "field": string, "startYear": string, "endYear": string }[],
  "experience": { "title": string, "company": string, "startDate": string, "endDate": string, "description": string }[],
  "certifications": string[],
  "languages": string[],
  "links": string[]
}

RESUME TEXT:
"""
${rawText.slice(0, 18000)}
"""`;

    try {
      const raw = await this.complete(system, prompt, true);
      const parsed = this.coerceParsedResume(this.extractJson(raw));
      // If the model returned nothing useful, blend with heuristics.
      if (!parsed.skills.length && !parsed.fullName) {
        return { parsed: this.mergeParsed(parsed, heuristicParseResume(rawText)), parsedBy: 'heuristic' };
      }
      return { parsed, parsedBy: 'llm' };
    } catch (err) {
      logger.warn(`LLM parseResume failed, using heuristic fallback: ${(err as Error).message}`);
      return { parsed: heuristicParseResume(rawText), parsedBy: 'heuristic' };
    }
  }

  /**
   * Score how well a candidate matches a job. Uses the LLM when available,
   * otherwise a deterministic skill-overlap algorithm.
   */
  async scoreMatch(input: {
    candidateSkills: string[];
    candidateSummary?: string;
    candidateExperienceYears?: number;
    jobTitle: string;
    jobSkills: string[];
    jobDescription: string;
    jobRequirements: string[];
  }): Promise<MatchResult> {
    const heuristic = this.heuristicMatch(input);
    if (!this.isEnabled) return heuristic;

    const system =
      'You are a technical recruiter. Evaluate how well a candidate matches a job. ' +
      'Respond with ONLY valid JSON, no markdown.';

    const prompt = `Given the candidate and job below, return strict JSON:
{ "matchScore": number (0-100), "matchedSkills": string[], "missingSkills": string[], "summary": string }

CANDIDATE:
- Skills: ${input.candidateSkills.join(', ') || 'N/A'}
- Experience: ${input.candidateExperienceYears ?? 'N/A'} years
- Summary: ${input.candidateSummary || 'N/A'}

JOB:
- Title: ${input.jobTitle}
- Required skills: ${input.jobSkills.join(', ') || 'N/A'}
- Requirements: ${input.jobRequirements.join('; ') || 'N/A'}
- Description: ${input.jobDescription.slice(0, 4000)}`;

    try {
      const raw = await this.complete(system, prompt, true);
      const json = this.extractJson(raw) as Partial<MatchResult>;
      return {
        matchScore: clampScore(json.matchScore ?? heuristic.matchScore),
        matchedSkills: arr(json.matchedSkills, heuristic.matchedSkills),
        missingSkills: arr(json.missingSkills, heuristic.missingSkills),
        summary: typeof json.summary === 'string' ? json.summary : heuristic.summary,
      };
    } catch (err) {
      logger.warn(`LLM scoreMatch failed, using heuristic: ${(err as Error).message}`);
      return heuristic;
    }
  }

  // ----------------------------------------------------------------------
  // Provider dispatch
  // ----------------------------------------------------------------------

  private async complete(system: string, user: string, jsonMode: boolean): Promise<string> {
    switch (env.LLM_PROVIDER) {
      case 'gemini':
        return this.callGemini(system, user, jsonMode);
      case 'groq':
      case 'openrouter':
        return this.callOpenAICompatible(system, user, jsonMode);
      default:
        throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
    }
  }

  private async callGemini(system: string, user: string, jsonMode: boolean): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${env.LLM_API_KEY}`;
    const body = {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.1,
        ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    };
    const data = await this.fetchJson(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty Gemini response');
    return text;
  }

  private async callOpenAICompatible(system: string, user: string, jsonMode: boolean): Promise<string> {
    const baseUrl =
      env.LLM_PROVIDER === 'groq'
        ? 'https://api.groq.com/openai/v1/chat/completions'
        : 'https://openrouter.ai/api/v1/chat/completions';
    const body = {
      model: this.model,
      temperature: 0.1,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    };
    const data = await this.fetchJson(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.LLM_API_KEY}` },
      body: JSON.stringify(body),
    });
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('Empty completion response');
    return text;
  }

  private async fetchJson(url: string, init: RequestInit): Promise<any> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`LLM HTTP ${res.status}: ${errText.slice(0, 300)}`);
      }
      return res.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  // ----------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------

  /** Extract the first JSON object/array from a model response string. */
  private extractJson(raw: string): unknown {
    const cleaned = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/[{[][\s\S]*[}\]]/);
      if (match) return JSON.parse(match[0]);
      throw new Error('No JSON found in LLM response');
    }
  }

  private coerceParsedResume(json: unknown): ParsedResume {
    const o = (json || {}) as Record<string, any>;
    return {
      fullName: str(o.fullName),
      email: str(o.email),
      phone: str(o.phone),
      location: str(o.location),
      summary: str(o.summary),
      skills: strArray(o.skills),
      totalExperienceYears:
        typeof o.totalExperienceYears === 'number' ? o.totalExperienceYears : undefined,
      education: Array.isArray(o.education) ? o.education.slice(0, 15) : [],
      experience: Array.isArray(o.experience) ? o.experience.slice(0, 30) : [],
      certifications: strArray(o.certifications),
      languages: strArray(o.languages),
      links: strArray(o.links),
    };
  }

  private mergeParsed(primary: ParsedResume, fallback: ParsedResume): ParsedResume {
    return {
      ...fallback,
      ...primary,
      skills: primary.skills.length ? primary.skills : fallback.skills,
      links: primary.links.length ? primary.links : fallback.links,
    };
  }

  private heuristicMatch(input: {
    candidateSkills: string[];
    jobSkills: string[];
    candidateExperienceYears?: number;
  }): MatchResult {
    const candidate = new Set(input.candidateSkills.map((s) => s.toLowerCase().trim()));
    const required = input.jobSkills.map((s) => s.trim()).filter(Boolean);

    const matchedSkills = required.filter((s) => candidate.has(s.toLowerCase()));
    const missingSkills = required.filter((s) => !candidate.has(s.toLowerCase()));

    const skillScore = required.length
      ? (matchedSkills.length / required.length) * 100
      : candidate.size
        ? 60
        : 30;

    const matchScore = clampScore(Math.round(skillScore));
    return {
      matchScore,
      matchedSkills,
      missingSkills,
      summary: required.length
        ? `Matched ${matchedSkills.length}/${required.length} required skills.`
        : 'Match estimated from candidate profile (no explicit job skills listed).',
    };
  }
}

// ---- small coercion helpers ----
function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}
function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return Array.from(new Set(v.filter((x) => typeof x === 'string' && x.trim()).map((x: string) => x.trim())));
}
function arr(v: unknown, fallback: string[]): string[] {
  const a = strArray(v);
  return a.length ? a : fallback;
}
function clampScore(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export const llmService = new LLMService();
