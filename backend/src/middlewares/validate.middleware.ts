import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

type Schema = AnyZodObject | ZodEffects<AnyZodObject>;

/**
 * Validates and (importantly) coerces req.body / req.query / req.params using a
 * Zod schema shaped like `{ body, query, params }`. Parsed values overwrite the
 * originals so downstream handlers receive typed, sanitised data.
 */
export function validate(schema: Schema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      const p = parsed as { body?: unknown; query?: unknown; params?: unknown };
      if (p.body !== undefined) req.body = p.body;
      // req.query / req.params are getters in Express 5; assign defensively.
      if (p.query !== undefined) Object.assign(req.query, p.query);
      if (p.params !== undefined) Object.assign(req.params, p.params);
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
