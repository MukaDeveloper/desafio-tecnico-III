import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '../../shared/utils/base.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Exam } from '../../services/exam/interfaces/exam.interface';
import { ExamService } from '../../services/exam/exam.service';
import { IEnvelopeArrayData } from '../../shared/models/envelope-data.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-exams',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './exams.html',
  styleUrl: './exams.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Exams extends BaseComponent implements AfterViewInit {
  public displayedColumns: string[] = ['patientName', 'modality', 'actions'];
  public dataSource = new MatTableDataSource<Exam>([]);
  public isLoading = true;
  public isBusy = false;
  public totalItems = 0;

  public pageSize = 25;
  public pageSizeOptions: number[] = [25, 50, 100];

  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;

  constructor(private readonly examService: ExamService) {
    super();
  }

  public ngAfterViewInit(): void {
    this.subscriptions.push(
      this.paginator.page.subscribe(() => {
        this.loadExams(this.paginator.pageIndex + 1, this.paginator.pageSize);
      })
    );

    this.loadExams(1, this.pageSize, true);
  }

  public onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public onNewExam() {}
  public onEditExam(patient: Exam) {}
  public onDeleteExam(patient: Exam) {}

  private loadExams(page: number = 1, pageSize: number = this.pageSize, initialLoad = false) {
    if (initialLoad) this.isLoading = true;

    this.isBusy = true;
    this.examService.getPaginated({ page, pageSize }).subscribe({
      next: (res) => this.manageDataSource(res.data, res.pagination),
      error: (err) => {
        this.isLoading = false;
        this.isBusy = false;
      },
    });
  }

  private manageDataSource(data: Exam[], pagination: IEnvelopeArrayData<Exam>['pagination']) {
    this.dataSource.filterPredicate = (data: Exam, filter: string) => {
      return (
        data.patient.name.toLowerCase().includes(filter) ||
        data.modality.toLowerCase().includes(filter) ||
        false
      );
    };

    this.dataSource.sortingDataAccessor = (item: Exam, property: string): any => {
      switch (property) {
        case 'patientMame':
          return item.patient.name.toLowerCase();
        case 'modality':
          return item.modality;
        default:
          return (item as any)[property];
      }
    };

    this.isLoading = false;
    this.isBusy = false;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = data;

    setTimeout(() => {
      this.paginator.pageIndex = pagination.currentPage - 1;
      this.paginator.pageSize = pagination.pageSize;
      this.paginator.length = pagination.totalItems;

      this.totalItems = pagination.totalItems;
    });
  }
}
