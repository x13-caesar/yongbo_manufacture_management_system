import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Employee} from '../shared/models/employee';
import {MatPaginator} from '@angular/material/paginator';
import {EmployeeService} from '../shared/http-services/employee.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../environments/environment';
import {CreateEmployeeDialogComponent} from './create-employee-dialog/create-employee-dialog.component';
import {CreateSalaryForOneDialogComponent} from '../salary/create-salary-for-one-dialog/create-salary-for-one-dialog.component';
import {Salary} from '../shared/models/salary';
import {CancelBatchConfirmDialogComponent} from '../manufacture/cancel-batch-confirm-dialog/cancel-batch-confirm-dialog.component';
import {ConfirmEmployeeLeaveDialogComponent} from './confirm-employee-leave-dialog/confirm-employee-leave-dialog.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit, AfterViewInit{
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
    this.employeeService.getEmployeesByStatus('working').subscribe(
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

  ngAfterViewInit() {}

  openCreateEmployeeDialog(): void {
    const dialogRef = this.dialog.open(CreateEmployeeDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe(new_employee => {
      if (new_employee) {
        // this.employees.push(new_employee);
        this.dataSource.data.push(new_employee);
        this.dataSource._updateChangeSubscription();
        this.dataSource.paginator = this.paginator;
        this.onSuccess('新员工添加');
      }

    });
  }

  onEmployeeSubmit(employee: Employee): void {
    this.employeeService.putEmployee(employee).subscribe(
      res => this.onSuccess('修改员工信息'),
      error => this.onFailure('修改员工信息')
    )
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  checkLastMonthSalary(emp: Employee) {
    const flag = new Date();
    flag.setDate(1);
    const end_date = new Date(flag.getTime());
    flag.setMonth(flag.getMonth()-1);
    const start_date = new Date(flag.getTime());
    console.log(start_date, end_date)
    const dialogRef = this.dialog.open(CreateSalaryForOneDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH,
      data: {employees: this.employees, target_employee: emp, start_date: start_date, end_date: end_date}
    });
    dialogRef.afterClosed().subscribe(
      ret_salary => {
        if (ret_salary) {
          this.onSuccess('薪水结算');
        }
      }
    );
  }

  onEmployeeLeave(emp: Employee) {
    const dialogRef = this.dialog.open(ConfirmEmployeeLeaveDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {employee: emp}
    });
    dialogRef.afterClosed().subscribe(
      updated_emp => {
        if (!!updated_emp) {
          const target_idx = this.dataSource.data.indexOf(emp)
          if (target_idx >= 0) {
            this.dataSource.data.splice(target_idx, 1);
            this.dataSource._updateChangeSubscription();
            this.onSuccess('修改员工状态');
          }
        }
      }
    );
  }
}
