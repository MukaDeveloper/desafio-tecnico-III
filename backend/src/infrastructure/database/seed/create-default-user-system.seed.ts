import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { UserSystem } from '@domain/entities/user-system.entity';
import { UserSystemStatus } from '@domain/enums/user-system-status.enum';

export async function createDefaultUserSystem(dataSource: DataSource) {
  const repository = dataSource.getRepository(UserSystem);

  const defaults: Partial<UserSystem>[] = [
    {
      id: '9df17fbb-b518-48a4-9bd6-09640ed14c28',
      name: 'Samuel Bertoni',
      email: 'adm@gmail.com',
      password: 'muka123',
      status: UserSystemStatus.ACTIVE,
      createdAt: getNowWithTimeZone(),
      createdBy: 'System',
      updatedAt: getNowWithTimeZone(),
      updatedBy: 'System',
    },
  ];

  for (let item of defaults) {
    (item as UserSystem).password = await bcrypt.hash(
      (item as UserSystem).password,
      Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    );
    await repository.save(item);
  }
}
