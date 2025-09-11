import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { HttpContextEnum } from '../../shared/models/enums/http-context-method.enum';
import { HttpContext } from '../../shared/models/http-context.model';
import { IEnvelopeArrayData, IEnvelopeData } from '../../shared/models/envelope-data.model';
import { HttpService } from '../../core/api/http.service';
import { PaginationQuery } from '../../shared/models/pagination-query.model';
import { Exam } from './interfaces/exam.interface';
import { ExamDto } from './dto/exam.dto';

@Injectable({ providedIn: 'root' })
export class ExamService {
  public exams$: BehaviorSubject<Exam[]> = new BehaviorSubject<Exam[]>([]);

  constructor(private readonly httpService: HttpService) {}

  public getPaginated(pagination: PaginationQuery): Observable<IEnvelopeArrayData<Exam>> {
    const context: HttpContext = {
      method: HttpContextEnum.GET,
      url: 'exames',
      params: pagination,
      headers: { 'Content-Type': 'application/json' },
    };

    return this.httpService.send<IEnvelopeArrayData<Exam>>(context).pipe(
      tap((res) => {
        this.exams$.next(res.data);
      }),
      map((res) => res)
    );
  }

  public create(dto: ExamDto): Observable<Exam> {
    const context: HttpContext = {
      method: HttpContextEnum.POST,
      url: 'exames',
      headers: { 'Content-Type': 'application/json' },
      body: dto,
    };

    return this.httpService.send<Exam>(context).pipe(
      tap((res) => {
      const current = this.exams$.value;
      this.exams$.next([res, ...current]);
      }),
      map((res) => res)
    );
  }

  public delete(examId: string): Observable<boolean> {
    const context: HttpContext = {
      method: HttpContextEnum.DELETE,
      url: `exames/${examId}`,
      headers: { 'Content-Type': 'application/json' },
    };

    return this.httpService.send<boolean>(context).pipe(
      tap((res) => {
        const current = this.exams$.value;
        const updated = current.filter(e => e.id != examId);
        this.exams$.next(updated)
      }),
      map((res) => res)
    );
  }
}
