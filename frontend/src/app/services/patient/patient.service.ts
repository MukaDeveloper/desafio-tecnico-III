import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Patient } from './interfaces/patient.interface';
import { HttpContextEnum } from '../../shared/models/enums/http-context-method.enum';
import { HttpContext } from '../../shared/models/http-context.model';
import { IEnvelopeArrayData, IEnvelopeData } from '../../shared/models/envelope-data.model';
import { HttpService } from '../../core/api/http.service';
import { PaginationQuery } from '../../shared/models/pagination-query.model';

@Injectable({ providedIn: 'root' })
export class PatientService {
  public patients$: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);

  constructor(private readonly httpService: HttpService) {}

  public getPaginated(pagination: PaginationQuery): Observable<IEnvelopeArrayData<Patient>> {
    const context: HttpContext = {
      method: HttpContextEnum.GET,
      url: 'pacientes',
      queryParams: pagination,
      headers: { 'Content-Type': 'application/json' },
    };

    return this.httpService.send<IEnvelopeArrayData<Patient>>(context).pipe(
      tap((res) => {
        this.patients$.next(res.data);
      }),
      map((res) => res)
    );
  }
}
