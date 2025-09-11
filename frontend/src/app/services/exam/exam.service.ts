import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpContextEnum } from '../../shared/models/enums/http-context-method.enum';
import { HttpContext } from '../../shared/models/http-context.model';
import { IEnvelopeArrayData, IEnvelopeData } from '../../shared/models/envelope-data.model';
import { HttpService } from '../../core/api/http.service';
import { PaginationQuery } from '../../shared/models/pagination-query.model';
import { Exam } from './interfaces/exam.interface';

@Injectable({ providedIn: 'root' })
export class ExamService {
  public exams$: BehaviorSubject<Exam[]> = new BehaviorSubject<Exam[]>([]);

  constructor(private readonly httpService: HttpService) {}

  public getPaginated(pagination: PaginationQuery): Observable<IEnvelopeArrayData<Exam>> {
    const context: HttpContext = {
      method: HttpContextEnum.GET,
      url: 'exames',
      queryParams: pagination,
      headers: { 'Content-Type': 'application/json' },
    };

    return this.httpService.send<IEnvelopeArrayData<Exam>>(context).pipe(
      tap((res) => {
        this.exams$.next(res.data);
      }),
      map((res) => res)
    );
  }
}
