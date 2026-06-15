import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(1, 'validation.required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'validation.nameMin'),
  email: z.string().email('validation.emailInvalid'),
  password: z.string().min(6, 'validation.passwordMin'),
})

export const orderSchema = z.object({
  description: z.string().min(1, 'validation.required'),
  amount: z.number({ error: 'validation.required' }).positive('validation.positiveNumber'),
  zipCode: z.string().length(8, 'validation.zipCodeLength'),
  street: z.string().min(1, 'validation.required'),
  number: z.string().min(1, 'validation.required'),
  neighborhood: z.string().min(1, 'validation.required'),
  city: z.string().min(1, 'validation.required'),
  state: z.string().length(2, 'validation.stateLength'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type OrderFormData = z.infer<typeof orderSchema>