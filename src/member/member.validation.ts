import { z, ZodType } from 'zod';

export class MemberValidation {
  static readonly REGISTER: ZodType = z.object({
    code: z.string().min(3).max(100),
    name: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly LOGIN: ZodType = z.object({
    code: z.string().min(3).max(100),
    password: z.string().min(1).max(100),
  });
}
