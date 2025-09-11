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
    const patient = ContextAccess.userName;

    entity.id = entity.id || uuid();
    entity.createdAt = entity.createdAt || getNowWithTimeZone();
    entity.createdBy = entity.createdBy || patient;
    entity.updatedAt = getNowWithTimeZone();
    entity.updatedBy = patient;
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const entity = event.entity;
    if (!entity) return;
    const patient = ContextAccess.userName;

    entity.id = entity.id || uuid();
    entity.createdAt = entity.createdAt || getNowWithTimeZone();
    entity.createdBy = entity.createdBy || patient;
    entity.updatedAt = getNowWithTimeZone();
    entity.updatedBy = patient;
  }
}
