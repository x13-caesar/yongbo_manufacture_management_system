import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BatchService} from '../../shared/http-services/batch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Employee} from '../../shared/models/employee';
import {Batch} from '../../shared/models/batch';
import {EmployeeService} from '../../shared/http-services/employee.service';

class DialogData {
  employee!: Employee
}

@Component({
  selector: 'app-confirm-employee-leave-dialog',
  templateUrl: './confirm-employee-leave-dialog.component.html',
  styleUrls: ['./confirm-employee-leave-dialog.component.scss']
})
export class ConfirmEmployeeLeaveDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmEmployeeLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private empService: EmployeeService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  letEmpGo(emp: Employee) {
    this.empService.putEmployee({...emp, status: 'left'}).subscribe(
      res => this.dialogRef.close(res),
      error => this.onFailure('修改员工状态')
    )
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

}
