import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ContextAccess } from '@middleware/context/context.access';
import { UserSystemService } from '@application/user-system/services/user-system.service';
import { UserSystemStatus } from '@domain/enums/user-system-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly userSystemService: UserSystemService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const responseMessage = await this.userSystemService.findByEmail(payload.email);

    if (responseMessage.statusCode !== 200 || !responseMessage.data)
      throw new UnauthorizedException('Usuario não encontrado.');

    const userData = responseMessage.data;
    if (!userData || userData.status !== UserSystemStatus.ACTIVE)
      throw new UnauthorizedException('Usuário inválido ou inativo');

    if (userData.name !== payload.name || userData.id !== payload.id)
      throw new UnauthorizedException('Usuário inválido ou inativo');

    const user = {
      id: userData.id,
      name: userData.name,
      type: 'Patient',
      email: userData.email,
    };

    ContextAccess.setUser(user);
    return user;
  }
}
