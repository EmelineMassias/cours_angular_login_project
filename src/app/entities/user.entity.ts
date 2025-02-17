export interface  UserHttp{
  id: number
  username: string
  password: string
  name: string
  role: 'customer' | 'admin'
  avatar: string
}

export interface  User {
  id: number
  username: string
  password: string
  name: string
  role: 'customer' | 'admin'
  avatar: string
}

export namespace User {
  export function fromHttp(http: UserHttp): User {
    return {
      id: http.id,
      username: http.username,
      password: http.password,
      name: http.name,
      role: http.role,
      avatar: http.avatar
    }
  }
}
