import type { Address } from '.'

export interface UserDto {
  id: string
  name: string
  email: string
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
