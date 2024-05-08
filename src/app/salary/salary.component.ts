import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Salary} from '../shared/models/salary';
import {MatPaginator} from '@angular/material/paginator';
import {SalaryService} from '../shared/http-services/salary.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {environment} from '../../environments/environment';
import {EmployeeService} from '../shared/http-services/employee.service';
import {Employee} from '../shared/models/employee';
import {CreateSalaryForOneDialogComponent} from './create-salary-for-one-dialog/create-salary-for-one-dialog.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {saveAs} from 'file-saver';
import {UtilService} from '../shared/util.service';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SalaryComponent implements OnInit {
  displayedProperties: string[] = [
    'employee_id', 'employee_name', 'start_date',
    'end_date', 'unit_salary',
    'hour_salary', 'deduction', 'bonus',
    'total', 'notice', 'status', 'check_date',
    'edit'
  ];

  displayedColumns = new Map([['employee_id', '员工工号'], ['employee_name','员工姓名'],
    ['start_date', '结算开始'], ['end_date', '结算结束'], ['unit_salary', '计件工资'], ['hour_salary', '计时工资'],
    ['deduction', '扣除额'], ['bonus', '增补额'], ['total', '总额'], ['notice', '备注'], ['status', '发放状态'], ['check_date', '发放日期'],
    ['edit', '操作']]);

  editableProperties: string[] = [
    'deduction', 'bonus', 'edit'
  ];

  displayedSalaries: Salary[] = []
  salaries: Salary[] = [];
  dataSource: any;

  employees: Employee[] = []

  filterGroup!: FormGroup;

  expandedElement!: Salary | null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public salaryService: SalaryService,
    private employeeService: EmployeeService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public _snackBar: MatSnackBar,
    private utilService: UtilService,
  ) { }

  ngOnInit(): void {
    if (!this.employeeService.employees.length) {
      this.employeeService.getWorkingEmployees().subscribe(
        res => this.employees = res
      );
    } else {
      this.employees = this.employeeService.employees;
    };
    this.filterGroup = this.formBuilder.group({
      keyword: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl('')
    });
    this.salaryService.getSalaries().subscribe(
      res => {
        this.salaries = res;
        this.displayedSalaries = this.salaries;
        this.dataSource = new MatTableDataSource<Salary>(this.displayedSalaries);
        this.dataSource.paginator = this.paginator;
      },
      error => console.log(error)
    );
    this.filterGroup.valueChanges.subscribe(changes => {
      this.displayedSalaries = this.salaryService.salarySearchFilter(this.displayedSalaries, changes)
      this.dataSource = new MatTableDataSource<Salary>(this.displayedSalaries);
      this.dataSource.paginator = this.paginator;
    });
  }

  openCreateSalaryDialog(): void {
  }

  payConfirm(salary: Salary) {
    const eventString = `确认支付${salary.employee_name}工资`;
    this.salaryService.paySalaryConfirm({
      ...salary,
      status: 'paid',
      check_date: this.utilService.getTimeStringAsUTC(new Date())
    }
    ).subscribe(
      ret_salary => {
        const idx = this.salaries.findIndex(salary => salary.id === ret_salary.id);
        this.salaries[idx] = ret_salary;
        this.displayedSalaries = this.salaries;
        this.dataSource = new MatTableDataSource<Salary>(this.displayedSalaries);
      },
      error => this.onFailure(eventString)
    )
  }

  deleteConfirm(salary: Salary) {
    const eventString = `删除${salary.employee_name}结算记录`;
    this.salaryService.deleteSalary(salary.id!).subscribe(
      res => {
        const targetIdx1 = this.salaries.findIndex(s => s.id === salary.id);
        this.salaries = this.salaries.splice(targetIdx1, 1);
        const targetIdx2 = this.displayedSalaries.findIndex(s => s.id === salary.id);
        this.displayedSalaries = this.displayedSalaries.splice(targetIdx2, 1);
        this.dataSource = new MatTableDataSource<Salary>(this.displayedSalaries);
        this.onSuccess(eventString);
      },
      error => this.onFailure(eventString)
    )
  }

  emptyFilter(): void {
    this.filterGroup.reset()
    this.displayedSalaries = this.salaries;
    this.dataSource = new MatTableDataSource<Salary>(this.displayedSalaries);
  }

  onSalarySubmit(salary: Salary): void {
    this.salaryService.putSalary(salary).subscribe(
      res => this.onSuccess('修改金额'),
      error => this.onFailure('修改金额')
    )
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  openCreateSalaryForOne() {
    const dialogRef = this.dialog.open(CreateSalaryForOneDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH,
      data: {employees: this.employees.filter(e => e.status === 'working')}
    });

    dialogRef.afterClosed().subscribe(
      ret_salary => {
        if (ret_salary) {
          this.salaries.push(ret_salary);
          this.displayedSalaries = this.salaries;
          this.dataSource = new MatTableDataSource<Salary>(this.displayedSalaries);
          this.onSuccess('薪水结算');
        }
      }
    );
  }

  readableDate(d: Date) {
    return d.toISOString();
  }

  downloadSalarySummary(salary_id: number, employee_name: string) {
    this.salaryService.downloadSalarySummary(salary_id).subscribe(
      blob => saveAs(blob, `${String(salary_id)}_${employee_name}.csv`),
      error => alert(`下载出错：${error.detail}`)
    )
  }
}
