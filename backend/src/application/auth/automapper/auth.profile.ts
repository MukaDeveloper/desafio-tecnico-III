import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenDto } from '../models/auth-token.dto';
import { Patient } from '@domain/entities/patient.entity';

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(
    @InjectMapper() mapper: Mapper,
    private jwtService: JwtService,
  ) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Patient,
        AuthTokenDto,
        forMember(
          (dest) => dest.patientId,
          mapFrom((src) => src.id),
        ),
        forMember(
          (dest) => dest.patientName,
          mapFrom((src) => src.name),
        ),
        forMember(
          (dest) => dest.patientEmail,
          mapFrom((src) => src.email),
        ),
        forMember(
          (dest) => dest.expiresIn,
          mapFrom(() => parseInt(process.env.JWT_EXPIRATION_SECONDS || '86400')),
        ),
        forMember(
          (dest) => dest.accessToken,
          mapFrom((src) =>
            this.jwtService.sign({
              id: src.id,
              name: src.name,
              email: src.email,
            }),
          ),
        ),
      );
    };
  }
}
