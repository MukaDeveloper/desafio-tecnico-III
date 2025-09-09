import { PatientService } from '@application/patient/services/patient.service';
import { PatientStatus } from '@domain/enums/patient-status.enum';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ContextAccess } from '@middleware/context/context.access';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly patientService: PatientService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const responseMessage = await this.patientService.findByEmail(payload.email);

    if (responseMessage.statusCode !== 200 || !responseMessage.data) 
      throw new UnauthorizedException('Usuario não encontrado.');

    const patientData = responseMessage.data;
    if (!patientData || patientData.status !== PatientStatus.Active) 
      throw new UnauthorizedException('Usuário inválido ou inativo');

    if (patientData.name !== payload.name || patientData.id !== payload.id)
      throw new UnauthorizedException('Usuário inválido ou inativo');

    const patient = {
      id: patientData.id,
      name: patientData.name,
      type: "Patient",
      email: patientData.email
    };

    ContextAccess.setPatient(patient);
    return patient;
  }
}
