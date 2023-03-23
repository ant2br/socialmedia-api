import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards,Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard.guard';
import { UserService } from './user.service';


@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('login')
  login(@Body() createUserDto: any): Promise<any> {
    return this.usersService.login(createUserDto);
  }

  @Post('register')
  register(@Body() createUserDto: any): Promise<any> {


    return this.usersService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate')
  validate(@Headers('authorization') authorization: string): Promise<boolean> {

    console.log(authorization)
    return this.usersService.validate(authorization);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  refresh(@Headers('authorization') authorization: string, @Body() token: any): Promise<any> {

    
    return this.usersService.refresh(authorization, token);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // findAll(): Promise<User[]> {
  //   return this.usersService.findAll();
  // }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<User> {
  //   return this.usersService.findOne(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
  //   return this.usersService.update(id, updateUserDto);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Delete(':id')
  // remove(@Param('id') id: string): Promise<void> {
  //   return this.usersService.remove(id);
  // }
}
