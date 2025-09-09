import { getNowWithTimeZone } from '@domain/commons/functions/get-now-with-timezone.function';
import { ContextAccess } from '@middleware/context/context.access';
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>) {
    const entity = event.entity;
    if (!entity) return;
    const patient = ContextAccess.PatientName;

    entity.Id = entity.Id || uuid();
    entity.CreatedAt = entity.CreatedAt || getNowWithTimeZone();
    entity.CreatedBy = entity.CreatedBy || patient;
    entity.UpdatedAt = getNowWithTimeZone();
    entity.UpdatedBy = patient;
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const entity = event.entity;
    if (!entity) return;
    const patient = ContextAccess.PatientName;

    entity.Id = entity.Id || uuid();
    entity.CreatedAt = entity.CreatedAt || getNowWithTimeZone();
    entity.CreatedBy = entity.CreatedBy || patient;
    entity.UpdatedAt = getNowWithTimeZone();
    entity.UpdatedBy = patient;
  }
}
