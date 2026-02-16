// oxlint-disable typescript/no-explicit-any
import { NextFunction, Request, Response } from 'express'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import { BaseError } from './errors'
import { Prisma } from '@prisma/client'
import { env } from './helpers'
import path from 'node:path'

export const ErrorHandler = (
  err: BaseError | string,
  req: Request,
  res: Response,
  next?: NextFunction,
) => {
  const logsDir = path.resolve(process.cwd(), 'storage/logs')
  const message = 'Something went wrong'
  let logContent = ''

  const error: Record<string, any> = {
    status: 'error',
    code: typeof err === 'string' || !err.statusCode ? 500 : err.statusCode,
    message: typeof err === 'string' ? `${message}: ${err}` : err.message || message,
  }

  if (typeof err !== 'string' && err.errors) {
    error.errors = err.errors
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    error.code = 404
    error.message = `${err.meta?.modelName} not found!`
  }

  if (
    typeof err !== 'string' &&
    env('NODE_ENV') === 'development' &&
    env<boolean>('HIDE_ERROR_STACK') !== true
  ) {
    error.stack = err.stack
  }

  try {
    mkdirSync(logsDir, { recursive: true })
    logContent = readFileSync(path.join(logsDir, 'error.log'), 'utf-8')
  } catch {
    /** */
  }

  const newLogEntry = `[${new Date().toISOString()}] ${typeof err === 'string' ? err : err.stack || err.message}\n\n`
  writeFileSync(path.join(logsDir, 'error.log'), logContent + newLogEntry, 'utf-8')

  res.status(error.code).json(error)
}

export default ErrorHandler
