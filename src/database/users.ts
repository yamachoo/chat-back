import { PrismaClient } from '@prisma/client'
import { ICreateUserQuery } from '../types'

const prisma = new PrismaClient()

export async function createUser (query: ICreateUserQuery) {
  await prisma.users.create({
    data: {
      name: query.name,
      email: query.email,
      password: query.password
    }
  })
}

export async function readUsers () {
  return await prisma.users.findMany()
}
