import jwt from 'jsonwebtoken'
import { clone, unset } from 'lodash-es'
export function findMembers(
  instance: any,
  {
    prefix,
    specifiedType,
    filter
  }: { prefix: string; specifiedType: any; filter: (value: string) => boolean }
) {
  function _find(instance: object): string[] {
    if (instance === null) return []
    let keys = Reflect.ownKeys(instance) as string[]

    keys = keys.filter((key) => {
      return _shouldKeep(key)
    })

    return [...keys, ..._find(Object.getPrototypeOf(instance))]
  }

  function _shouldKeep(value: string) {
    if (filter) {
      if (filter(value)) {
        return true
      }
    }
    if (prefix) if (value.startsWith(prefix)) return true
    if (specifiedType) if (instance[value] instanceof specifiedType) return true
  }

  return _find(instance)
}

export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}

/**
 * 生成token
 */
export function generateToken(
  uid: string,
  storeId: string,
  name: string,
  scope: string | number
) {
  const privateKey = process.env.PRIVATE_KEY as string
  const token = jwt.sign(
    {
      uid,
      storeId,
      name,
      scope
    },
    privateKey,
    {
      // expiresIn: 5
      expiresIn: 60 * 60 * 24 * 30
    }
  )
  return token
}


