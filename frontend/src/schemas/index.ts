import * as z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
