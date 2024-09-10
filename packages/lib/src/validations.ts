import z from "zod";

export const createLabValidations = z.object({
  slug: z.string().min(5),
  template: z.string().min(3),
});
