import type { AuthResponse, User } from '@/@types'
import { mockDb } from '@/api/mock-db'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

const delay = async (ms = 400): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await delay()
    const users = mockDb.getUsers()

    const exists = users.some((user) => user.email === payload.email)
    if (exists) {
      throw new Error('Este e-mail já está cadastrado.')
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: payload.name,
      email: payload.email,
    }

    mockDb.saveUsers([...users, newUser])

    return {
      token: btoa(`${newUser.id}:${Date.now()}`),
      user: newUser,
    }
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    await delay()
    const users = mockDb.getUsers()
    const foundUser = users.find((user) => user.email === payload.email)

    if (!foundUser || payload.password.length < 6) {
      throw new Error('Credenciais inválidas.')
    }

    return {
      token: btoa(`${foundUser.id}:${Date.now()}`),
      user: foundUser,
    }
  },

  async me(token: string): Promise<User> {
    await delay(250)
    if (!token) {
      throw new Error('Não autorizado')
    }

    const userId = atob(token).split(':')[0]
    const user = mockDb.getUsers().find((item) => item.id === userId)

    if (!user) {
      throw new Error('Não autorizado')
    }

    return user
  },
}
