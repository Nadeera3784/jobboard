import * as z from "zod";

import { RoleConstants } from '../constants';

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const CreateCategorySchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  status: z.optional(z.string())
});

export const CreateUserSchema = z.object({
  name: z.string().min(5, {
    message: "Name is required",
  }),
  email: z
  .string()
  .min(1, { message: "Email is required" })
  .email("This is not a valid email."),
  role: z.enum([RoleConstants.ADMIN, RoleConstants.USER]),
  phone: z.optional(z.string().max(12, {
    message: "Phone number must be 12 characters max"
  })),
  status: z.optional(z.string()),
  image: z.optional(
    z.any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
  ),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})
.refine((data) => {
  if (data.confirmPassword && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Password is required!",
  path: ["password"]
})

.refine((data) => {
  if (data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "The passwords did not match",
  path: ["confirmPassword"]
});


export const UpdateUserSchema = z.object({
  name: z.string().min(5, {
    message: "Name is required",
  }),
  email: z
  .string()
  .min(1, { message: "Email is required" })
  .email("This is not a valid email."),
  role: z.enum([RoleConstants.ADMIN, RoleConstants.USER]),
  phone: z.optional(z.string().max(12, {
    message: "Phone number must be 12 characters max"
  })),
  status: z.optional(z.string()),
  image: z.optional(
    z.any()
  )
})