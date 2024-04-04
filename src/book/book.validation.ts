import { z, ZodType } from 'zod';

export class BookValidation {
  static readonly CREATE: ZodType = z.object({
    code: z.string().min(3),
    title: z.string().min(1),
    author: z.string().min(1),
    stock: z.number().min(1),
  });
}
