import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Employee} from '../../shared/models/employee';
import {EmployeeService} from '../../shared/http-services/employee.service';
import {UtilService} from '../../shared/util.service';

@Component({
  selector: 'app-create-employee-dialog',
  templateUrl: './create-employee-dialog.component.html',
  styleUrls: ['./create-employee-dialog.component.scss']
})
export class CreateEmployeeDialogComponent implements OnInit {

  employeeGroup!: FormGroup;
  newEmployee!: Employee

  constructor(
    public dialogRef: MatDialogRef<CreateEmployeeDialogComponent>,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public utilService: UtilService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.employeeGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      birth: new FormControl(''),
      phone: new FormControl('', Validators.required),
      ssn: new FormControl(''),
      department: new FormControl(''),
      notice: new FormControl('')
    })
  }

  onSubmit(form: FormGroup): void {
    const newEmployee = {...form.value, status: 'working', onboard: this.utilService.mysqlDatetimeTransformer(new Date())};
    // update date / datetime formatting
    newEmployee['birth'] = newEmployee['birth'].toISOString().slice(0, 10)
    console.log(newEmployee);
    this.employeeService.postEmployee(newEmployee).subscribe(
      res => {
        console.log(res);
        this.dialogRef.close(res);
      }
    )
  }

  onFailure(): void {
    this._snackBar.open(`创建失败`, "关闭");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
