import { env, secureOtp } from './helpers'

import { Strategy as FacebookStrategy } from 'passport-facebook'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import argon2 from 'argon2'
import { prisma } from '../DB'

export const googleStrategy = () => {
  return new GoogleStrategy(
    {
      clientID: env('GOOGLE_CLIENT_ID', 'dummy'),
      clientSecret: env('GOOGLE_CLIENT_SECRET', 'dummy'),
      callbackURL: env('GOOGLE_CALLBACK'),
      scope: ['profile'],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile.emails?.find((e) => !!e.value)?.value
        const user = await prisma.user.findFirst({
          where: { googleId: profile.id },
        })
        if (user) {
          return cb(undefined, user!)
        }
        const cUser = await prisma.user.create({
          data: {
            firstName: profile.name?.givenName ?? '',
            lastName: profile.name?.familyName ?? '',
            email: email ?? `${profile.id}@gmail.com`,
            password: await argon2.hash(secureOtp(32)),
            googleId: profile.id,
          },
        })
        return cb(undefined, cUser)
      } catch (error) {
        return cb(error)
      }
    },
  )
}

export const facebookStrategy = () => {
  return new FacebookStrategy(
    {
      clientID: env('FACEBOOK_CLIENT_ID', 'dummy'),
      clientSecret: env('FACEBOOK_CLIENT_SECRET', 'dummy'),
      callbackURL: env('FACEBOOK_CALLBACK'),
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async function (accessToken, refreshToken, profile, cb) {
      try {
        const email = profile.emails?.find((e) => !!e.value)?.value
        const user = await prisma.user.findFirst({
          where: { facebookId: profile.id },
        })
        if (user) {
          return cb(undefined, user!)
        }
        const cUser = await prisma.user.create({
          data: {
            firstName: profile.name?.givenName ?? '',
            lastName: profile.name?.familyName ?? '',
            email: email ?? `${profile.id}@facebook.com`,
            password: await argon2.hash(secureOtp(32)),
            facebookId: profile.id,
          },
        })
        return cb(undefined, cUser)
      } catch (error) {
        return cb(error)
      }
    },
  )
}
