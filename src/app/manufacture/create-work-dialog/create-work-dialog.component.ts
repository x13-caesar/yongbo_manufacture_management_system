import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Work} from '../../shared/models/work';
import {BatchProcess} from '../../shared/models/batch-process';
import {Employee} from '../../shared/models/employee';
import {Observable} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map} from 'rxjs/operators';
import {Compo} from '../../shared/models/compo';
import {WorkSpecification} from '../../shared/models/work-specification';
import {WorkService} from '../../shared/http-services/work.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {WorkSpecificationService} from '../../shared/http-services/work-specification.service';
import {SpecService} from '../../shared/http-services/spec.service';
import {EmployeeService} from '../../shared/http-services/employee.service';
import {UtilService} from '../../shared/util.service';

class DialogData {
  bp!: BatchProcess;
  batch_plan_unit!: number;
  employees!: Employee[];
  product_name!: string;
}

@Component({
  selector: 'app-create-work-dialog',
  templateUrl: './create-work-dialog.component.html',
  styleUrls: ['./create-work-dialog.component.scss']
})
export class CreateWorkDialogComponent implements OnInit {
  new_work!: Work;
  batchProcess!: BatchProcess;

  employees: Employee[] = [];
  employeeOptions!: Observable<Employee[]>;
  selectedEmployee = new FormControl(null, Validators.required);

  workSpecGroup = new FormGroup({});
  work_date = new FormControl(new Date(), Validators.required);
  plan_unit = new FormControl(
    0,
    [Validators.required, Validators.max(this.data.bp.start_amount ?? this.data.batch_plan_unit), Validators.min(1)]
  )

  constructor(
    public dialogRef: MatDialogRef<CreateWorkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private workService: WorkService,
    public employeeService: EmployeeService,
    private wsService: WorkSpecificationService,
    private specService: SpecService,
    public _snackBar: MatSnackBar,
    public utilService: UtilService
  ) { }

  ngOnInit(): void {
    this.batchProcess = this.data.bp;
    this.employees = this.data.employees;
    this.employeeOptions = this.selectedEmployee.valueChanges.pipe(
      map(name => this.employeeService.employeeAutocompleteFilter(name, this.employees)));
    this.batchProcess.warehouse_record?.forEach(
      wr => this.workSpecGroup.addControl(
        wr.specification_id,
        this.formBuilder.control(
          '',
          [Validators.required, Validators.min(0)]
        )
      )
    );
    this.plan_unit.valueChanges.subscribe(value => this.batchProcess.warehouse_record?.forEach(
      wr => this.workSpecGroup.controls[wr.specification_id].setValidators(
        [Validators.required, Validators.min(0), Validators.max(value * wr.consumption * 1.1)])
    ));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onWorkConfirm(): void {
    const work_specification_array: WorkSpecification[] = [];
    this.new_work = {
      complete_hour: 0, complete_unit: 0, hour_pay: 0, unit_pay: 0,
      batch_id: this.batchProcess.batch_id,
      batch_process_id: this.batchProcess.id || 0,
      employee_id: this.selectedEmployee.value.id,
      employee_name: this.selectedEmployee.value.name,
      product_name: this.data.product_name,
      process_name: this.batchProcess.process?.process_name || '',
      work_date: this.utilService.getTimeStringAsUTC(this.work_date.value),
      plan_unit: this.plan_unit.value,
      check: false, salary_id: undefined,
    }
    this.workService.postWork(this.new_work).subscribe(
      res_work => {
        this.batchProcess.warehouse_record?.forEach(
          wr => {
            const ws: WorkSpecification = {
              work_id: res_work.id,
              specification_id: wr.specification_id,
              plan_amount: this.plan_unit.value * wr.consumption,
              actual_amount: this.workSpecGroup.controls[wr.specification_id].value,
              component_name: wr.component_name,
              specification_gross_price: wr.specification_gross_price,
              specification_net_price: wr.specification_net_price
            }
            this.wsService.postWorkSpecification(ws).subscribe(
              res_ws => {
                work_specification_array.push(res_ws);
                this.specService.adjustSpecStock(res_ws.specification_id, 0-Number(res_ws.actual_amount)).subscribe();
              }
            )
          }
        );
        this.dialogRef.close({...res_work, work_specification: work_specification_array});
      },
      error => {
        console.log(error);
        this.onFailure();
      }
    )
  }

  onSuccess(): void {
    this._snackBar.open(`创建成功`, "关闭");
  }

  onFailure(): void {
    this._snackBar.open(`创建失败`, "关闭");
  }

  ifInputValid(): boolean {
    return this.workSpecGroup.valid && this.work_date.valid && this.selectedEmployee.valid && this.plan_unit.valid
  }

}
