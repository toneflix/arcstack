import { JwtPayload } from 'jsonwebtoken'

export type Flatten<T> =
  T extends Record<string, unknown>
    ? { [K in keyof T as T[K] extends Record<string, unknown> ? never : K]: T[K] } & {
        [K in keyof T as T[K] extends Record<string, unknown>
          ? `${string & K}.${string & keyof Flatten<T[K]>}`
          : never]: T[K] extends Record<string, unknown>
          ? Flatten<T[K]>[keyof Flatten<T[K]>]
          : never
      }
    : never

export interface JwtUser extends JwtPayload {
  username: string
  id: string
  iat: number
  exp: number
}
