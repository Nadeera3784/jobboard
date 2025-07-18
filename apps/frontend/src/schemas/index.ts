import * as z from 'zod';

import { RoleConstants, UserStatusConstants } from '../constants';

const MAX_FILE_SIZE = 100000;

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const CreateCategorySchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  status: z.optional(z.string()),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters',
    }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email('This is not a valid email.'),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm password must be at least 6 characters',
    }),
    role: z.enum([RoleConstants.USER, RoleConstants.COMPANY], {
      message: 'Please select your account type',
    }),
    phone: z.optional(z.string()),
    terms: z.boolean().refine(val => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine(
    data => {
      if (data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'The passwords did not match',
      path: ['confirmPassword'],
    },
  );

export const CreateUserSchema = z
  .object({
    name: z.string().min(5, {
      message: 'Name is required',
    }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email('This is not a valid email.'),
    role: z.enum([RoleConstants.ADMIN, RoleConstants.USER]),
    phone: z.optional(
      z.string().max(12, {
        message: 'Phone number must be 12 characters max',
      }),
    ),
    status: z.enum([UserStatusConstants.ACTIVE, UserStatusConstants.INACTIVE]),
    image: z
      .instanceof(File)
      .optional()
      .refine(file => file && file?.size <= MAX_FILE_SIZE, {
        message: `File size must be less than 1MB.`,
      })
      .refine(file => file && ACCEPTED_IMAGE_TYPES.includes(file?.type), {
        message: '.jpg, .jpeg, .png and .webp files are accepted.',
      }),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })

  .refine(
    data => {
      if (data.confirmPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    },
  )

  .refine(
    data => {
      if (data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'The passwords did not match',
      path: ['confirmPassword'],
    },
  );

export const UpdateUserSchema = z.object({
  name: z.string().min(5, {
    message: 'Name is required',
  }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email('This is not a valid email.'),
  role: z.enum([
    RoleConstants.ADMIN,
    RoleConstants.USER,
    RoleConstants.COMPANY,
  ]),
  phone: z.optional(
    z.string().max(12, {
      message: 'Phone number must be 12 characters max',
    }),
  ),
  status: z.optional(z.string()),
  image: z.optional(z.any()),
});

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Email is required',
    })
    .email('This is not a valid email.'),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
});

export const CreateJobSchema = z.object({
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  status: z.optional(z.string()),
  location: z.string().min(1, {
    message: 'Location is required',
  }),
  category: z.string().min(1, {
    message: 'Category is required',
  }),
  remote: z.string().min(1, {
    message: 'Remote is required',
  }),
  job_type: z.string().min(1, {
    message: 'Job type is required',
  }),
  experience_level: z.string().min(1, {
    message: 'Experience level is required',
  }),
  description: z.string().min(1, {
    message: 'Description level is required',
  }),
  user: z.optional(z.string()),
});
