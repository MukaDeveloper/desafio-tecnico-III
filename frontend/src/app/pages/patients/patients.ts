import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BaseComponent } from '../../shared/utils/base.component';
import { Patient } from '../../services/patient/interfaces/patient.interface';
import { PatientService } from '../../services/patient/patient.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { IEnvelopeArrayData } from '../../shared/models/envelope-data.model';

@Component({
  selector: 'app-patients',
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Patients extends BaseComponent implements AfterViewInit {
  public displayedColumns: string[] = ['name', 'document', 'actions'];
  public dataSource = new MatTableDataSource<Patient>([]);
  public isLoading = true;
  public isBusy = false;
  public totalItems = 0;

  public pageSize = 25;
  public pageSizeOptions: number[] = [25, 50, 100];

  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;

  constructor(private readonly patientService: PatientService) {
    super();
  }

  public ngAfterViewInit(): void {
    this.subscriptions.push(
      this.paginator.page.subscribe(() => {
        this.loadPatients(this.paginator.pageIndex + 1, this.paginator.pageSize);
      })
    );

    this.loadPatients(1, this.pageSize, true);
  }

  public onApplyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  public onNewPatient() {}
  public onEditPatient(patient: Patient) {}
  public onDeletePatient(patient: Patient) {}

  private loadPatients(page: number = 1, pageSize: number = this.pageSize, initialLoad = false) {
    if (initialLoad) this.isLoading = true;

    this.isBusy = true;
    this.patientService.getPaginated({ page, pageSize }).subscribe({
      next: (res) => this.manageDataSource(res.data, res.pagination),
      error: (err) => {
        this.isLoading = false;
        this.isBusy = false;
      },
    });
  }

  private manageDataSource(data: Patient[], pagination: IEnvelopeArrayData<Patient>['pagination']) {
    this.dataSource.filterPredicate = (data: Patient, filter: string) => {
      return (
        data.name.toLowerCase().includes(filter) ||
        data.document.toLowerCase().includes(filter) ||
        false
      );
    };

    this.dataSource.sortingDataAccessor = (item: Patient, property: string): any => {
      switch (property) {
        case 'name':
          return item.name.toLowerCase();
        case 'document':
          return item.document;
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
