import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret-key', // chave secreta para assinar o token JWT
    })
  ],
  controllers: [UserController],
  providers: [UserService,PrismaClient],
})
export class UserModule {}
