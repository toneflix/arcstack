import express, { Express } from 'express'
import { facebookStrategy, googleStrategy } from './utils/passport'

import ErrorHandler from './utils/request-handlers'
import { Router } from '@core/Router'
import cors from 'cors'
import { env } from './utils/helpers'
import methodOverride from 'method-override'
import passport from 'passport'
import path from 'path'
import { prisma } from '@core/DB'

export default class Application {
  private app: Express
  private static app: Express

  constructor(app?: Express) {
    this.app = app ?? express()
    Application.app = this.app
  }

  static getExpressInstance() {
    return Application.app
  }

  public async boot(port: number) {
    // Parse application/json
    this.app.use(express.json())

    // Parse application/x-www-form-urlencoded (for non-multipart forms)
    this.app.use(express.urlencoded({ extended: true }))

    // Load public assets
    this.app.use(express.static(path.join(process.cwd(), 'public')))

    // Method Override
    this.app.use(methodOverride('X-HTTP-Method'))

    // Handle CORS
    this.app.use(cors())

    // Passport
    if (env('GOOGLE_CLIENT_ID')) {
      passport.use(googleStrategy())
    }
    if (env('FACEBOOK_CLIENT_ID')) {
      passport.use(facebookStrategy())
    }

    // Initialize Passport
    this.app.use(passport.initialize())

    // Bind the router
    this.app.use(Router.bind())

    // Error Handler
    this.app.use(ErrorHandler)

    // Start the server
    this.app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  }

  async shutdown() {
    await prisma.$disconnect()
    process.exit(0)
  }
}
