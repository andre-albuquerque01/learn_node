/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, Post, ConflictException, UsePipes } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prima: PrismaService) {}
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password} = body

    const userWithSameEmail = await this.prima.user.findUnique({
        where: {
          email,
        },
    })

    if (userWithSameEmail) {
      throw new ConflictException('User with same email already exists')
    }

    const passwordHash = await hash(password, 8)

    await this.prima.user.create({
      data: { 
        name,
        email,
        password: passwordHash,
      },
    })
  }
}
