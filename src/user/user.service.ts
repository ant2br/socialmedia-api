import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserService {

    constructor(private jwtService: JwtService,private prisma: PrismaClient) {}


    async findByEmail(email: string): Promise<any> {

        var user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })

        return user;
        
    }


    //register

    async register(userRequest: any) {

        console.log(userRequest)

        var user = await this.findByEmail(userRequest.email)

        if(user) {
            console.log("to no if")
            return null;
        }

        console.log("passei aqui")

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(userRequest.password, salt);

        var userCreated = await this.prisma.user.create({
            data: {
                email: userRequest.email,
                password: hash,
                name: userRequest.name
            }
        })


        if(!userCreated) {
            return null;
        }

        

        
        // Create a copy of userCreated object without the password field
        const { password, ...userWithoutPassword } = userCreated;

        return userWithoutPassword;

    }
    async login(userRequest: any) {


        var user = await this.findByEmail(userRequest.email)

        if(!user) {
            return null;
        }

        if(!bcrypt.compare(userRequest.password, user.password)){{
            return null;
        }}

        const { password, ...userWithoutPassword } = user;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1); // expira em 24 horas a partir de agora
        const expirationSeconds = Math.floor(expirationDate.getTime() / 1000);

        const payload = { username: user.name, sub: user.userId,exp: Math.floor(Date.now() / 1000) + 60 };
        const payload2 = { username: user.name, sub: user.userId, isRefreshToken: true, exp: expirationSeconds};
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload2),
            user: userWithoutPassword
        };
    }


    async validate(token: string){
            
            try {
                const jwtToken = token.split(' ')[1];
                const payload = this.jwtService.verify(jwtToken);
                return true;
            } catch (error) {
                return false;
            }
    }


    async refresh(token: string, refreshToken: string) {
        try {
            const decodedRefresh = this.jwtService.decode(refreshToken);
            const decodedToken = this.jwtService.decode(token);

            if(decodedRefresh.sub != decodedToken.sub) {
                return null;
            }

            var user = await this.prisma.user.findUnique({
                where: {
                    id: decodedToken.sub
                }
            })

            if(!user) {
                return null;
            }


            const verifyRefresh = this.jwtService.verify(refreshToken);

            if(!verifyRefresh) {
                return null;
            }





            const payload = { username: user.name, sub: user.id };
            const decoded = this.jwtService.sign(payload);



            return decoded;
          } catch (e) {
            return null;
          }
    }

}
