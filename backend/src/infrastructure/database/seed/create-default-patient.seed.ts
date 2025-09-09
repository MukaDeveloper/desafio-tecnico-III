import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Patient } from '@domain/entities/patient.entity';
import { PatientStatus } from '@domain/enums/patient-status.enum';
import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';

export async function createDefaultPatient(dataSource: DataSource) {
  const repository = dataSource.getRepository(Patient);

  const defaults: Partial<Patient>[] = [
    {
      id: '9d1e25b6-f352-76e9-5311-d63b35a6f351',
      name: 'Samuel Bertoni',
      email: 'muka.bertoni@gmail.com',
      document: '00000000000',
      password: 'muka123',
      status: PatientStatus.Active,
      createdAt: getNowWithTimeZone(),
      createdBy: 'System',
      updatedAt: getNowWithTimeZone(),
      updatedBy: 'System',
    },
  ];

  for (let item of defaults) {
    (item as Patient).password = await bcrypt.hash(
      (item as Patient).password,
      Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    );
    await repository.save(item);
  }
}
