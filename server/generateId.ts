import { customAlphabet } from 'nanoid'

export function generateId(): string {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10)
    return nanoid()
}
