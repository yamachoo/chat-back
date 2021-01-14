import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type user = {
  name: string,
  email: string
}

export async function createUser (query: user): Promise<void> {
  await prisma.users.create({
    data: {
      name: query.name,
      email: query.email
    }
  })
}
