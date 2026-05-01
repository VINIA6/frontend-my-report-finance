import { api } from './api'

export type UserType = 'clt' | 'cnpj'

export interface LoginResponse {
  access_token: string
  token_type: string
  user_id: string
  email: string
  user_type: UserType
  salary: number | null
}

export interface RegisterResponse {
  id: string
  email: string
  user_type: UserType
  salary: number | null
  created_at: string
}

export const authService = {
  login(email: string, password: string) {
    return api.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data)
  },

  register(email: string, password: string, userType: UserType, salary?: number) {
    return api
      .post<RegisterResponse>('/auth/register', {
        email,
        password,
        user_type: userType,
        ...(salary != null && { salary }),
      })
      .then(r => r.data)
  },
}
