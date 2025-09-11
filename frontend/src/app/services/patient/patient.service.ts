import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Patient } from './interfaces/patient.interface';
import { HttpContextEnum } from '../../shared/models/enums/http-context-method.enum';
import { HttpContext } from '../../shared/models/http-context.model';
import { IEnvelopeArrayData, IEnvelopeData } from '../../shared/models/envelope-data.model';
import { HttpService } from '../../core/api/http.service';
import { PaginationQuery } from '../../shared/models/pagination-query.model';
import { PatientDto } from './dto/patient.dto';

@Injectable({ providedIn: 'root' })
export class PatientService {
  public patients$: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

  constructor(private readonly httpService: HttpService) {}

  public getPaginated(pagination: PaginationQuery): Observable<IEnvelopeArrayData<Patient>> {
    const context: HttpContext = {
      method: HttpContextEnum.GET,
      url: 'pacientes',
      params: pagination,
      headers: { 'Content-Type': 'application/json' },
    };

    return this.httpService.send<IEnvelopeArrayData<Patient>>(context).pipe(
      tap((res) => {
        this.patients$.next(res.data);
      }),
      map((res) => res)
    );
  }

  public create(dto: PatientDto): Observable<Patient> {
    const context: HttpContext = {
      method: HttpContextEnum.POST,
      url: 'pacientes',
      headers: { 'Content-Type': 'application/json' },
      body: dto,
    };

    return this.httpService.send<Patient>(context).pipe(
      tap((res) => {
        const current = this.patients$.value;
        const updated = [...current, res];
        this.patients$.next(updated);
      }),
      map((res) => res)
    );
  }

  public update(dto: PatientDto): Observable<Patient> {
    const context: HttpContext = {
      method: HttpContextEnum.PUT,
      url: `pacientes/${dto.id}`,
      headers: { 'Content-Type': 'application/json' },
      body: dto,
    };

    return this.httpService.send<Patient>(context).pipe(
      tap((res) => {
        const current = this.patients$.value;
        const index = current.findIndex((p) => (p.id = dto.id!));
        if (index > -1) current[index] = res;
        else current.push(res);
        this.patients$.next(current);
      }),
      map((res) => res)
    );
  }

  public delete(patientId: string): Observable<boolean> {
    const context: HttpContext = {
      method: HttpContextEnum.DELETE,
      url: `pacientes/${patientId}`,
      headers: { 'Content-Type': 'application/json' },
    };

    return this.httpService.send<boolean>(context).pipe(
      tap((res) => {
        const current = this.patients$.value;
        const updated = current.filter((e) => e.id != patientId);
        this.patients$.next(updated);
      }),
      map((res) => res)
    );
  }
}
