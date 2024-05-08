import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {BatchProcess} from '../../shared/models/batch-process';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {WorkService} from '../../shared/http-services/work.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BatchProcessService} from '../../shared/http-services/batch-process.service';
import {Form, FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable, Subject} from 'rxjs';
import {Employee} from '../../shared/models/employee';
import {EmployeeService} from '../../shared/http-services/employee.service';
import {map} from 'rxjs/operators';
import {Work} from '../../shared/models/work';
import {WarehouseRecord} from '../../shared/models/warehouse-record';
import {UtilService} from '../../shared/util.service';

class DialogData {
  product_name!: string;
  bp!: BatchProcess;
  employees!: Employee[];
}


@Component({
  selector: 'app-update-batch-process-status-dialog',
  templateUrl: './update-batch-process-status-dialog.component.html',
  styleUrls: ['./update-batch-process-status-dialog.component.scss']
})
export class UpdateBatchProcessStatusDialogComponent implements OnInit {
  workForm!: FormGroup;
  employeeOptions!: Observable<Employee[]>;
  showSummary: boolean = false;
  summary: any = {
    unit: 0,
    hour: 0,
    unit_pay: 0,
    hour_pay: 0,};
  participatedEmployeeSelected!: FormControl;
  newWorksToSubmit!: Work[];

  @ViewChild('completeUnit') complete_unit_input: ElementRef;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UpdateBatchProcessStatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private BPService: BatchProcessService,
    public employeeService: EmployeeService,
    public utilService: UtilService,
    public _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.newWorksToSubmit = [];
    this.participatedEmployeeSelected = new FormControl(null, [Validators.required]);
    this.workForm = this.fb.group({
      batch_id: new FormControl(this.data.bp.batch_id),
      batch_process_id: new FormControl(this.data.bp.id),
      employee_id: new FormControl(null, Validators.required),
      employee_name: new FormControl(null, Validators.required),
      work_date: new FormControl(new Date(), Validators.required),
      plan_unit: new FormControl(this.data.bp.start_amount || 0, Validators.required),
      complete_unit: new FormControl(null, [Validators.required, Validators.min(1)]),
      complete_hour: new FormControl(0),
      unit_pay: new FormControl(this.data.bp.process.unit_pay),
      hour_pay: new FormControl(0),
      product_name: new FormControl(this.data.product_name, Validators.required),
      process_name: new FormControl(this.data.bp.process?.process_name, Validators.required),
      check: new FormControl(false)
    });
    this.employeeOptions = this.participatedEmployeeSelected.valueChanges.pipe(map(input => this.employeeService.employeeAutocompleteFilter(input, this.data.employees)))
    this.activeEmployeeSelectionResponse();
    this.workForm.valueChanges.subscribe(data => console.log(this.workForm));
  }

  activeEmployeeSelectionResponse() {
    this.participatedEmployeeSelected.valueChanges.subscribe(employee => {
      if (!!employee) {
        this.workForm.get('employee_id')?.setValue(employee.id);
        this.workForm.get('employee_name')?.setValue(employee.name);
      }
    })
  }

  onConfirmSubmit() {
    const updated_bp = {...this.data.bp, work: this.newWorksToSubmit};
    this.BPService.finishBatchProcess(updated_bp).subscribe(response_bp => {
      this.dialogRef.close(response_bp);
    }, err => {alert(err);}
    )
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  onAddNewParticipant() {
    const newWork: Work = {
      ...this.workForm.value,
      work_date: this.utilService.getTimeStringAsUTC(this.workForm.controls['work_date'].value)
    }
    this.newWorksToSubmit.push(newWork);
    // reset all form fields
    this.workForm.setValue({
      batch_id: this.data.bp.batch_id,
      batch_process_id: this.data.bp.id,
      employee_id: null,
      employee_name: null,
      work_date: new Date(),
      plan_unit: this.data.bp.start_amount || 0,
      complete_unit: null,
      complete_hour: 0,
      unit_pay: this.data.bp.process.unit_pay,
      hour_pay: 0,
      product_name: this.data.product_name,
      process_name: this.data.bp.process?.process_name,
      check: false,
    });
    this.participatedEmployeeSelected.setValue(null);
    this.activeEmployeeSelectionResponse();
    // refresh summary data
    this.calculateSummary();
  }

  removeParticipant(i: number) {
    this.newWorksToSubmit.splice(i, 1);
    this.calculateSummary();
  }

  calculateSummary() {
    this.summary = this.newWorksToSubmit.reduce((sum, w) => {
        return {
          unit: sum.unit + w.complete_unit,
          hour: sum.hour + w.complete_hour,
          unit_pay: sum.unit_pay + w.unit_pay * w.complete_unit,
          hour_pay: sum.hour_pay + w.hour_pay * w.complete_hour,
        }
      },
      {unit: 0, hour: 0, unit_pay: 0, hour_pay: 0});
  }

  calculateTotalComponentNetPrice(wr_array: WarehouseRecord[]) {
    return wr_array.reduce((wr, curr) => wr + (curr.specification_net_price || 0) * curr.consumption * this.summary.unit, 0)
  }

  calculateTotalComponentGrossPrice(wr_array: WarehouseRecord[]) {
    return wr_array.reduce((wr, curr) => wr + (curr.specification_gross_price || 0) * curr.consumption * this.summary.unit, 0)
  }

  isEmployeeUniqueInWorks() {
    //check if elements in this.newWorksToSubmit have duplicated value for key employee_id
    const eids = this.newWorksToSubmit.map(w => w.employee_id)
    return new Set(eids).size === eids.length
  }

  currentTotalCompleteUnits(): number {
    return this.newWorksToSubmit.reduce(
      (prev, curr) => curr.complete_unit + prev, 0
    )
  }

  isWorksValidToSubmit() {
    const hasWorks = this.newWorksToSubmit && this.newWorksToSubmit.length > 0
    const employeeUnique = this.isEmployeeUniqueInWorks()
    const unitUnderPlan = this.data.bp.start_amount >= this.currentTotalCompleteUnits()
    return hasWorks && employeeUnique && unitUnderPlan
  }

  jumpToCompleteUnit() {
    setTimeout(()=>{
      this.complete_unit_input.nativeElement.focus();
      },0);
  }
}
