import { z } from "zod";

export const productSchema = z.object({
  photo: z.string({
    required_error: "Photo is requred",
  }),
  title: z.string({
    required_error: "title is requred",
  }),
  price: z.coerce.number({
    required_error: "price is requred",
  }),
  description: z.string({
    required_error: "description is requred",
  }),
});

export type ProductType = z.infer<typeof productSchema>;
