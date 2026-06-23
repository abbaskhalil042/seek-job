import { ParsedResume } from '../types';

/**
 * Zero-dependency fallback resume parser. Used when no LLM provider is
 * configured or the LLM call fails. It is intentionally conservative —
 * extracting what can be reliably found via patterns and a skill dictionary.
 */

// A pragmatic dictionary of common tech / professional skills.
const SKILL_DICTIONARY = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'golang',
  'rust', 'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'dart',
  // Frontend
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'redux', 'tailwind',
  'html', 'css', 'sass', 'shadcn', 'material ui', 'bootstrap', 'jquery',
  // Backend
  'node.js', 'nodejs', 'express', 'nestjs', 'django', 'flask', 'fastapi',
  'spring', 'spring boot', 'laravel', 'rails', '.net', 'graphql', 'rest',
  // Databases
  'mongodb', 'postgresql', 'postgres', 'mysql', 'redis', 'sqlite', 'oracle',
  'elasticsearch', 'dynamodb', 'cassandra', 'firebase', 'supabase',
  // Cloud / DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
  'ci/cd', 'github actions', 'gitlab', 'nginx', 'linux', 'bash',
  // Data / ML
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'pandas',
  'numpy', 'scikit-learn', 'nlp', 'data analysis', 'tableau', 'power bi',
  // Practices / tools
  'git', 'agile', 'scrum', 'jira', 'microservices', 'kafka', 'rabbitmq',
  'testing', 'jest', 'cypress', 'selenium', 'figma',
];

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/;
const URL_RE = /\b((?:https?:\/\/|www\.)[^\s,)]+|(?:linkedin|github)\.com\/[^\s,)]+)/gi;
const YEARS_EXP_RE = /(\d{1,2})\+?\s*(?:years?|yrs?)\b[^.\n]*?experience|experience[^.\n]*?(\d{1,2})\+?\s*(?:years?|yrs?)/i;

export function heuristicParseResume(rawText: string): ParsedResume {
  const text = rawText || '';
  const lower = text.toLowerCase();
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const email = text.match(EMAIL_RE)?.[0];
  const phone = text.match(PHONE_RE)?.[0]?.trim();

  const links = Array.from(new Set((text.match(URL_RE) || []).map((l) => l.replace(/[.,]$/, ''))));

  // Skills via dictionary lookup (word-boundary-ish).
  const skills = Array.from(
    new Set(
      SKILL_DICTIONARY.filter((skill) => {
        const safe = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(^|[^a-z0-9])${safe}([^a-z0-9]|$)`, 'i').test(lower);
      }).map(titleCaseSkill),
    ),
  );

  // Years of experience.
  const expMatch = text.match(YEARS_EXP_RE);
  const totalExperienceYears = expMatch
    ? Number(expMatch[1] || expMatch[2]) || undefined
    : undefined;

  // Name heuristic: first non-empty line that looks like a person's name.
  const fullName = guessName(lines, email);

  // Section-based education extraction (very light-touch).
  const education = extractEducation(lines);

  return {
    fullName,
    email,
    phone,
    location: undefined,
    summary: undefined,
    skills,
    totalExperienceYears,
    education,
    experience: [],
    certifications: [],
    languages: [],
    links,
  };
}

function guessName(lines: string[], email?: string): string | undefined {
  for (const line of lines.slice(0, 6)) {
    const words = line.split(/\s+/);
    const looksLikeName =
      words.length >= 2 &&
      words.length <= 4 &&
      words.every((w) => /^[A-Z][a-zA-Z.'-]+$/.test(w));
    if (looksLikeName) return line;
  }
  // Fall back to the local-part of the email.
  if (email) {
    return email
      .split('@')[0]
      .replace(/[._\d]+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || undefined;
  }
  return undefined;
}

function extractEducation(lines: string[]): ParsedResume['education'] {
  const degreeRe =
    /(b\.?\s?tech|m\.?\s?tech|b\.?\s?sc|m\.?\s?sc|b\.?\s?e\b|bachelor|master|ph\.?d|mba|b\.?\s?a\b|m\.?\s?a\b)/i;
  const result: ParsedResume['education'] = [];
  for (const line of lines) {
    if (degreeRe.test(line)) {
      const year = line.match(/(19|20)\d{2}/g);
      result.push({
        degree: line.slice(0, 120),
        endYear: year ? year[year.length - 1] : undefined,
      });
      if (result.length >= 5) break;
    }
  }
  return result;
}

function titleCaseSkill(skill: string): string {
  const specialCases: Record<string, string> = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    'next.js': 'Next.js',
    nextjs: 'Next.js',
    'node.js': 'Node.js',
    nodejs: 'Node.js',
    nestjs: 'NestJS',
    graphql: 'GraphQL',
    mongodb: 'MongoDB',
    postgresql: 'PostgreSQL',
    aws: 'AWS',
    gcp: 'GCP',
    'ci/cd': 'CI/CD',
    nlp: 'NLP',
    html: 'HTML',
    css: 'CSS',
    'power bi': 'Power BI',
  };
  return specialCases[skill] || skill.replace(/\b\w/g, (c) => c.toUpperCase());
}
