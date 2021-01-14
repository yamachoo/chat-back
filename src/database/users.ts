import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type user = {
  name: string | null,
  email: string,
  password: string
}

export async function createUser (query: user) {
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
