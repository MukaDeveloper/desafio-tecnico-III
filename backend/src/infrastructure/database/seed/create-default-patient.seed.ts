import { DataSource } from 'typeorm';
import { Patient } from '@domain/entities/patient.entity';
import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';

export async function createDefaultPatient(dataSource: DataSource) {
  const repository = dataSource.getRepository(Patient);

  const defaults: Partial<Patient>[] = [
    {
      id: '9d1e25b6-f352-76e9-5311-d63b35a6f351',
      name: 'Samuel Bertoni',
      document: '00000000000',
      createdAt: getNowWithTimeZone(),
      createdBy: 'System',
      updatedAt: getNowWithTimeZone(),
      updatedBy: 'System',
    },
  ];

  for (let item of defaults) {
    await repository.save(item);
  }
}
