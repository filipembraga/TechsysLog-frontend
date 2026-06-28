import type { Address } from '.'

export interface UserDto {
  id: string
  name: string
  email: string
}
export interface UserResponseDto extends UserDto {
  createdAt: string
}

export interface LoginResponseDto {
  token: string
  user: UserDto
}

export interface CreateOrderRequestDto {
  description: string
  amount: number
  deliveryAddress: Address
}

export interface ApiErrorResponseDto {
  statusCode: number
  message: string
}
