import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EmployeeService} from '../../shared/http-services/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Employee} from '../../shared/models/employee';

class DialogData {
  employee!: Employee
}

@Component({
  selector: 'app-confirm-employee-resume-dialog',
  templateUrl: './confirm-employee-resume-dialog.component.html',
  styleUrls: ['./confirm-employee-resume-dialog.component.scss']
})
export class ConfirmEmployeeResumeDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmEmployeeResumeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private empService: EmployeeService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  bringEmployeeBack(emp: Employee) {
    this.empService.putEmployee({...emp, status: 'working'}).subscribe(
      res => this.dialogRef.close(res),
      error => this.onFailure('修改员工状态')
    )
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }
}
