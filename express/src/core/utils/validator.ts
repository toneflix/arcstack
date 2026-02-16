// oxlint-disable typescript/no-explicit-any
import { InitialRules, make, register, setTranslationObject } from 'simple-body-validator'

import { ValidationError } from './errors'
import { prisma } from 'src/core/DB'

type InferInput<X, A extends boolean = false> = A extends true
  ? Promise<{ [P in keyof X]: any }>
  : { [P in keyof X]: any }

const modelExists = async (
  rule: 'unique' | 'exists',
  value: any,
  field: string,
  modelName?: string,
  exception?: (string | undefined)[],
) => {
  const [except, exceptField]: string[] = exception?.filter((e) => typeof e == 'string') ?? []

  try {
    if (!modelName) {
      return false
    }

    const model: { count: (q: any) => Promise<number> } = (prisma as any)[modelName]

    const count = await model.count({
      where: except
        ? {
            [field]: value,
            [exceptField ?? 'id']: { not: except },
          }
        : {
            [field]: value,
          },
    })

    return count >= 1
  } catch {
    return false
  }
}

setTranslationObject({
  en: {
    unique: 'The selected :attribute is not available.',
    exists: 'The selected :attribute does not exist.',
  },
})

register('unique', async function (value, parameters, attribute) {
  const [modelName, field, except, exceptField] = parameters ?? []
  return (
    (await modelExists('exists', value, field ?? attribute, modelName, [except, exceptField])) ===
    false
  )
})

register('exists', async function (value, parameters, attribute) {
  const [modelName, field, _except] = parameters ?? []
  return (await modelExists('exists', value, field ?? attribute, modelName)) === true
})

const validator = <X extends InitialRules, A extends boolean = false>(
  data: { [key: string]: any } | undefined,
  rules: X,
  async: A,
  attrs?: { [key: string]: string },
  msgs?: { [key: string]: string },
): InferInput<X, A> => {
  const castValue = (value: any, fieldRules: string[]): any => {
    if (fieldRules.includes('boolean') && value !== undefined) {
      return ['1', 1, true, 'true'].includes(value)
    }
    if (fieldRules.includes('integer') || fieldRules.includes('numeric')) {
      return parseFloat(value) || 0 // Fallback to 0 if invalid
    }
    if (fieldRules.includes('nullable') && (!value || value === '')) {
      // console.log(value, 'valuevaluevalue')
      return undefined
    }
    if (value === undefined || typeof value === 'object') {
      return value
    }
    return String(value) // Default to string
  }

  const ouputData = (filter = true) => {
    const result = {} as InferInput<X, false>

    if (!data) return {}

    for (const keyX of Object.keys(rules) as (keyof X)[]) {
      const key = keyX.toString().split('.').at(0) as string

      if (data[key as string] !== undefined || filter === false) {
        const fieldRules = Array.isArray(rules[key]) ? rules[key] : rules[key].toString().split('|')
        result[key as typeof keyX] = castValue(data[key as string], fieldRules)
      }
    }

    if (filter === false) {
      return Object.assign(data, result)
    }

    return result
  }

  const validator = make()
    .setData(ouputData(false))
    .setRules(rules)
    .setCustomAttributes(attrs)
    .setCustomMessages(msgs)

  const respond = (isValid: boolean) => {
    if (!isValid) {
      const errors = validator.errors()

      const count = errors.keys().length
      let message = errors.firstMessage || 'Unknown Error'
      message += count > 1 ? ` And ${count - 1} other error(s).` : ''

      throw new ValidationError(message, errors.all())
    }
  }

  if (async) {
    return (async () => {
      respond(await validator.validateAsync())
      return ouputData()
    })() as InferInput<X, A>
  } else {
    respond(validator.validate())
    return ouputData() as InferInput<X, A>
  }
}

export const validate = <X extends InitialRules>(
  data: { [key: string]: any },
  rules: X,
  attrs?: { [key: string]: string },
  msgs?: { [key: string]: string },
) => validator(data, rules, false, attrs, msgs)

export const validateAsync = async <X extends InitialRules>(
  data: { [key: string]: any },
  rules: X,
  attrs?: { [key: string]: string },
  msgs?: { [key: string]: string },
) => await validator(data, rules, true, attrs, msgs)
