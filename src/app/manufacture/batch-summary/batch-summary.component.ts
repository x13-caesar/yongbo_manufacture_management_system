import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BatchService} from '../../shared/http-services/batch.service';
import {Batch} from '../../shared/models/batch';
import {ProductService} from '../../shared/http-services/product.service';
import {BatchProcessService} from '../../shared/http-services/batch-process.service';
import {WorkService} from '../../shared/http-services/work.service';
import {WorkSpecification} from '../../shared/models/work-specification';
import {SpecService} from '../../shared/http-services/spec.service';
import {Work} from '../../shared/models/work';
import {BatchProcess} from '../../shared/models/batch-process';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-batch-summary',
  templateUrl: './batch-summary.component.html',
  styleUrls: ['./batch-summary.component.scss']
})
export class BatchSummaryComponent implements OnInit {
  batch_id!: number;
  batch!: Batch;
  ideal_consumption = new Map();
  actual_consumption = new Map();

  constructor(
    private route: ActivatedRoute,
    private batchService: BatchService,
    private productService: ProductService,
    public bpService: BatchProcessService,
    private specService: SpecService
  ) { }

  ngOnInit(): void {
    this.batch_id = Number(this.route.snapshot.paramMap.get('bid')) || 0;
    this.batchService.getBatch(this.batch_id).subscribe(
      res => {
        this.batch = res;
        this.productService.getProductNameById(this.batch.product_id).subscribe(
          prod => this.batch.product_name = prod.name
        );
        this.batch.batch_process.forEach(bp => {
          bp.work?.forEach(w => {
            w.actual_total_spec_cost = this.calculateWorkGrossCost(w);
            w.actual_unit_spec_cost = w.actual_total_spec_cost/w.complete_unit;
            w.actual_unit_overall_cost = w.actual_unit_spec_cost + w.unit_pay;
            w.work_specification?.forEach(ws => {
              const prev_value = this.actual_consumption.get(ws.component_name) || 0;
              this.actual_consumption.set(ws.component_name, (prev_value + ws.actual_amount));
            })
          });
          bp.ideal_unit_spec_cost = bp.warehouse_record?.reduce((prev, wr) => prev + wr.specification_gross_price! * wr.consumption, 0) || 0;
          bp.actual_total_spec_cost = bp.work?.reduce((prev, w) => prev + (w.actual_total_spec_cost || 0), 0) || 0;
          bp.actual_unit_spec_cost = bp.actual_total_spec_cost/bp.end_amount!;
          bp.ideal_total_work_cost = (bp.start_amount || 0) * bp.unit_pay;
          bp.actual_total_work_cost = bp.work?.reduce((prev, w) => prev + (w.hour_pay * w.complete_hour || w.unit_pay * w.complete_unit), 0) || 0;
          bp.actual_overall_cost = bp.actual_total_spec_cost + bp.actual_total_work_cost;
          bp.warehouse_record?.forEach(wr => {
            const prev_value = this.ideal_consumption.get(wr.component_name) || 0;
            this.ideal_consumption.set(wr.component_name, (prev_value + wr.consumption));
          });
        });
        this.batch.ideal_unit_spec_cost = this.batch.batch_process.reduce(
          (prev, bp) => prev + bp.ideal_unit_spec_cost!, 0);
        this.batch.ideal_unit_work_cost = this.batch.batch_process.reduce(
          (prev, bp) => prev + bp.unit_pay!, 0);
        this.batch.actual_total_spec_cost = this.batch.batch_process.reduce(
          (prev, bp) => prev + bp.actual_total_spec_cost!, 0);
        this.batch.actual_total_work_cost = this.batch.batch_process.reduce(
          (prev, bp) => prev + bp.actual_total_work_cost!, 0);
        this.batch.actual_unit_spec_cost = this.batch.actual_total_spec_cost/this.batch.actual_amount!;
        this.batch.actual_unit_overall_cost = (this.batch.actual_total_spec_cost + this.batch.actual_total_work_cost)/this.batch.actual_amount!;
      }
    )
  }

  checkGrossPriceExist(work: Work): boolean {
    return !!work.work_specification?.every(ws => !!ws.specification_gross_price);
  }

  calculateWorkAttribution(work: Work): number {
    const sum = {act: 0, plan: 0}
    work.work_specification?.forEach(ws => {
      sum.act += (ws.actual_amount || 0);
      sum.plan += ws.plan_amount;
    })
    return (sum.act-sum.plan)/sum.plan
  }

  calculateWorkGrossCost(work: Work): number {
    if (this.checkGrossPriceExist(work)) {
      return work.work_specification?.reduce((prev, curr) => prev + (curr.specification_gross_price! * curr.actual_amount!), 0) || 0
    } else {
      return 0;
    }
  }

  calculateWorkPlanCost(work: Work): number {
    if (work.work_specification?.every(ws => !!ws.specification_gross_price)) {
      return work.work_specification?.reduce((prev, curr) => prev + (curr.specification_gross_price! * curr.plan_amount!), 0) || 0
    } else {
      return 0;
    }
  }

  calculateExtraExpense(work: Work): number {
    return this.calculateWorkGrossCost(work) - this.calculateWorkPlanCost(work)
  }

  calculateBatchProcessPlanCost(bp: BatchProcess): number {
    if (bp.work?.every(w => this.checkGrossPriceExist(w))) {
      return bp.work?.reduce((prev, w) => prev + this.calculateWorkPlanCost(w), 0) || 0
    } else {
      return 0
    }
  }

  calculateBatchProcessActualCost(bp: BatchProcess): number {
    if (bp.work?.every(w => this.checkGrossPriceExist(w))) {
      return bp.work?.reduce((prev, w) => prev + this.calculateWorkGrossCost(w), 0) || 0
    } else {
      return 0
    }
  }

  downloadExcel(batch_id: number) {
    this.batchService.downloadBatchSummary(batch_id).subscribe(
      blob => saveAs(blob, `${this.batch_id}.csv`),
      error => console.log(error)
    )
  }
}
