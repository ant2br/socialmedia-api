import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Acesso não autorizado');
    }

    try {
      const token = authorization.substring(7);
      const payload = this.jwtService.verify(token);

      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Acesso não autorizado');
    }


  }
}
