import { DateTime } from 'luxon';

export function getNowWithTimeZone(date?: Date | string | null): Date {
  const timeZone = process.env.TIME_ZONE || 'America/Sao_Paulo';

  const baseDate = date
    ? DateTime.fromJSDate(new Date(date)).setZone('utc') // Interpreta como UTC
    : DateTime.now().setZone(timeZone);

  return baseDate.toJSDate(); // retorna o Date em UTC, ideal para salvar
}
