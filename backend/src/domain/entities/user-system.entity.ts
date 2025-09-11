import { Entity, Column } from "typeorm";
import { AuditableEntity } from "./auditable-entity";
import { UserSystemStatus } from "@domain/enums/user-system-status.enum";

@Entity('usersystem')
export class UserSystem extends AuditableEntity {
  @Column({ name: 'name', type: 'varchar', length: 150, nullable: false })
  name!: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email!: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password!: string;

  @Column({ name: 'status', type: 'smallint', nullable: false, enum: UserSystemStatus })
  status!: UserSystemStatus;
}