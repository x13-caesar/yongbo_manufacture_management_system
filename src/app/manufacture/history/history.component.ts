import { Component, OnInit } from '@angular/core';
import {Batch} from '../../shared/models/batch';
import {BatchProcess} from '../../shared/models/batch-process';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BatchService} from '../../shared/http-services/batch.service';
import {EmployeeService} from '../../shared/http-services/employee.service';
import {ProductService} from '../../shared/http-services/product.service';
import {MatListOption} from '@angular/material/list';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  displayedBatches: Batch[] = []
  selectedBatch!: Batch;
  selectedBatchProcess!: BatchProcess;

  step = 1;

  specChoiceGroup!: FormGroup;

  constructor(
    private batchService: BatchService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private productService: ProductService,
  ) { }


  ngOnInit(): void {
    this.batchService.getCollectedBatches().subscribe(
      res => {
        this.displayedBatches = res;
        this.displayedBatches.forEach(b => {
          this.productService.getProductNameById(b.product_id).subscribe(
            res => b.product_name = res.name,
            error => console.log(error)
          );
        })
      },
      error => console.log(error)
    );
    this.specChoiceGroup = this.formBuilder.group({});
  }

  onBatchChange(options: MatListOption[]) {
    // map these MatListOptions to their values
    this.selectedBatch = options[0].value;
    this.step = this.selectedBatch.batch_process.find(bp => bp.status === 'ongoing')?.process?.process_order || 1;
    this.specChoiceGroup = new FormGroup({});
  }

  updateSpecChoiceGroup(bp: BatchProcess): void {
    // this.selectedBatchProcess = bp;
    this.specChoiceGroup = this.formBuilder.group({});
    bp.process?.process_component.forEach(
      pc => {
        this.specChoiceGroup.addControl(pc.component_id, this.formBuilder.control('', Validators.required));
      }
    );
    if (bp.warehouse_record && bp.warehouse_record.length > 0) {
      bp.warehouse_record.forEach(wr => {
        const compo_id = wr.component_id;
        const spec_id = wr.specification_id;
        const selectedSpec = bp.process?.process_component.find(pc => pc.component_id === compo_id)?.component?.specification?.find(spec => spec.id === spec_id)
        this.specChoiceGroup.controls[compo_id].setValue(selectedSpec);
      });
      this.specChoiceGroup.disable();
    } else {
      this.specChoiceGroup.enable();
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  sortedBatchProcesses(bp_array: BatchProcess[]): BatchProcess[] {
    return bp_array.sort((a, b) => (Number(a.process?.process_order) - Number(b.process?.process_order)))
  }

}
