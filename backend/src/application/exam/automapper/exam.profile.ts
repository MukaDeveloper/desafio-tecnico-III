import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Exam } from '@domain/entities/exam.entity';
import { ExamDto } from '@application/exam/models/exam.dto';
import { Patient } from '@domain/entities/patient.entity';
import { PatientDto } from '@application/patient/models/patient.dto';

@Injectable()
export class ExamProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Exam,
        ExamDto,
        forMember(
          (dest) => dest.id,
          mapFrom((src) => src.id),
        ),
        forMember(
          (dest) => dest.modality,
          mapFrom((src) => src.modality),
        ),
        forMember(
          (dest) => dest.idempotencyKey,
          mapFrom((src) => src.idempotencyKey),
        ),
        forMember(
          (dest) => dest.patientId,
          mapFrom((src) => src.patientId),
        ),
        forMember(
          (dest) => dest.patient,
          mapFrom((src) => mapper.map(src.patient, Patient, PatientDto)),
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
