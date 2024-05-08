import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Employee} from '../../shared/models/employee';
import {MatPaginator} from '@angular/material/paginator';
import {EmployeeService} from '../../shared/http-services/employee.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../../environments/environment';
import {ConfirmEmployeeResumeDialogComponent} from '../confirm-employee-resume-dialog/confirm-employee-resume-dialog.component';

@Component({
  selector: 'app-hidden-employee',
  templateUrl: './hidden-employee.component.html',
  styleUrls: ['./hidden-employee.component.scss']
})
export class HiddenEmployeeComponent implements OnInit {
  displayedProperties: string[] = [
    'id', 'name', 'gender', 'phone',
    'ssn', 'department', 'notice', 'edit'
  ];

  displayedColumns = new Map([['id', '工号'], ['name','姓名'],
    ['gender', '性别'], ['phone', '联系电话'], ['ssn', '身份证号'], ['department', '部门'], ['notice', '备注'],
    ['edit', '操作']]);

  searchKeyword = new FormControl('')
  employees: Employee[] = [];
  dataSource: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeeService: EmployeeService,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeService.getEmployeesByStatus('left').subscribe(
      res => {
        this.employeeService.employees = res;
        this.employees = res;
        this.dataSource = new MatTableDataSource<Employee>(this.employees);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log(error)
    );
    this.searchKeyword.valueChanges.subscribe(
      kw => {
        this.dataSource = new MatTableDataSource<Employee>(this.employeeService.employeeSearchFilter(this.employees, kw));
        this.dataSource.paginator = this.paginator;
      })
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  onEmployeeResume(emp: Employee) {
    const dialogRef = this.dialog.open(ConfirmEmployeeResumeDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {employee: emp}
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (!!res) {
          this.onSuccess('修改员工状态');
          const idx = this.employees.findIndex(e => e.id === emp.id);
          this.employees.splice(idx, 1);
          this.dataSource = new MatTableDataSource<Employee>(this.employees);
        }
      }
    );
  }

}
