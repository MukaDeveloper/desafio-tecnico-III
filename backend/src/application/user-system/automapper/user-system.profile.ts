import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { UserSystem } from '@domain/entities/user-system.entity';
import { UserSystemDto } from '../models/user-system.dto';

@Injectable()
export class UserSystemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserSystem,
        UserSystemDto,
        forMember(
          (dest) => dest.id,
          mapFrom((src) => src.id),
        ),
        forMember(
          (dest) => dest.name,
          mapFrom((src) => src.name),
        ),
        forMember(
          (dest) => dest.email,
          mapFrom((src) => src.email),
        ),
        forMember(
          (dest) => dest.status,
          mapFrom((src) => src.status),
        ),
        forMember(
          (dest) => dest.createdAt,
          mapFrom((src) => src.createdAt),
        ),
        forMember(
          (dest) => dest.createdBy,
          mapFrom((src) => src.createdBy),
        ),
        forMember(
          (dest) => dest.updatedAt,
          mapFrom((src) => src.updatedAt),
        ),
        forMember(
          (dest) => dest.updatedBy,
          mapFrom((src) => src.updatedBy),
        ),
      );
    };
  }
}
