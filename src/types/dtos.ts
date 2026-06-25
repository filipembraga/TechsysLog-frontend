export interface UserDto {
  id: string
  name: string
  email: string
}

export interface LoginResponseDto {
  token: string
  user: UserDto
}
