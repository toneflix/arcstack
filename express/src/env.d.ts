import { IUser } from './models/interfaces'

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      user?: User | undefined
      authToken?: string | undefined
    }
  }
  interface String {
    titleCase(): string
    camelCase(): string
    /**
     *
     * @param len Length of the string
     * @param suffix Suffix to add to the string
     */
    truncate(len: number = 20, suffix: string = '...'): string
  }
}

export {}
