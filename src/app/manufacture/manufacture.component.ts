import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Batch} from '../shared/models/batch';
import {BatchService} from '../shared/http-services/batch.service';
import {MatListOption} from '@angular/material/list';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BatchProcess} from '../shared/models/batch-process';
import {Employee} from '../shared/models/employee';
import {EmployeeService} from '../shared/http-services/employee.service';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../environments/environment';
import {ProductService} from '../shared/http-services/product.service';
import {WorkService} from '../shared/http-services/work.service';
import {Work} from '../shared/models/work';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CompleteWorkDialogComponent} from './complete-work-dialog/complete-work-dialog.component';
import {WarehouseRecord} from '../shared/models/warehouse-record';
import {BatchProcessService} from '../shared/http-services/batch-process.service';
import {CreateBatchDialogComponent} from './create-batch-dialog/create-batch-dialog.component';
import {WarehouseRecordService} from '../shared/http-services/warehouse-record.service';
import {CompoService} from '../shared/http-services/compo.service';
import {UtilService} from '../shared/util.service';
import {SpecService} from '../shared/http-services/spec.service';
import {ActivatedRoute} from '@angular/router';
import {JWTTokenService} from '../shared/http-services/jwt-token.service';
import {lackStockValidation} from '../shared/lack-stock.directive';
import {CancelBatchConfirmDialogComponent} from './cancel-batch-confirm-dialog/cancel-batch-confirm-dialog.component';
import {Spec} from '../shared/models/spec';
import {UpdateBatchProcessStatusDialogComponent} from './update-batch-process-status-dialog/update-batch-process-status-dialog.component';
import {MatLegacyListOption} from '@angular/material/legacy-list';
import {SelectionModel} from '@angular/cdk/collections';
import {logger} from 'codelyzer/util/logger';

@Component({
  selector: 'app-manufacture',
  templateUrl: './manufacture.component.html',
  styleUrls: ['./manufacture.component.scss']
})
export class ManufactureComponent implements OnInit {

  displayId!: string;
  displayedBatches: Batch[] = [];
  selectedBatch!: Batch | null;
  selectedBatchProcess!: BatchProcess;

  loadingFlag = false;
  step = 1;
  batchTitleClass = new Map([['ongoing', 'success'], ['urgent', 'warn'], ['unstarted', 'promise'], ['cancelled', 'cancelled']])
  statusMap = new Map([['ongoing', '生产中 🕗'], ['urgent', '加急 ‼️'], ['unstarted', '未开始 💭'], ['finished', '已完成 ✅']])


  specChoiceGroup!: FormGroup;
  workingEmployees: Employee[] = [];

  constructor(
    public jwtTokenService: JWTTokenService,
    private batchService: BatchService,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private productService: ProductService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private workService: WorkService,
    private _snackBar: MatSnackBar,
    private specService: SpecService,
    private bpService: BatchProcessService,
    private wrService: WarehouseRecordService,
    private compoService: CompoService,
    private util: UtilService
  ) {
  }

  ngOnInit(): void {
    this.displayId = String(this.route.snapshot.paramMap.get('batch_id'));
    // start loading
    this.loadingFlag = true;
    this.batchService.autoUpdateBatchStatus().subscribe(
      res => {
        res.success && this.batchService.getUnfinishedBatches().subscribe(
          res => {
            this.displayedBatches = res;
            if (!!this.displayId) {
              this.displayedBatches.forEach(b => {
                if (String(b.id) === String(this.displayId)) {
                  this.selectedBatch = b;
                }
              });
            }
          },
          error => console.log(error),

        );
      },
      error => {console.log(error)},
      () => {this.loadingFlag=false;}
    );
    this.employeeService.getEmployeesByStatus('working').subscribe(
      res => this.workingEmployees = res,
      error => console.log(error)
    );
    this.specChoiceGroup = this.formBuilder.group({});
  }

  onBatchChange(options: SelectionModel<any>) {
    this.selectedBatch = options.selected[0].value;
    this.step = this.selectedBatch?.batch_process.find(bp => bp.status === 'ongoing' || bp.status === 'unstarted')?.process?.process_order || 1;
  }

  updateSpecChoiceGroup(bp: BatchProcess): void {
    // this.selectedBatchProcess = bp;
    this.specChoiceGroup = this.formBuilder.group({});
    bp.process?.process_component.forEach(
      pc => {
        this.specChoiceGroup.addControl(pc.component_id, this.formBuilder.control('', [Validators.required, lackStockValidation(pc.consumption*(bp.start_amount || 1))]));
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

  lastProcessFinished(bp: BatchProcess) {
    if (this.selectedBatch) {
      const currentProcessOrder = bp.process?.process_order || 1
      if (currentProcessOrder === 1) {
        return true
      } else {
        const sortedProcesses = this.sortedBatchProcesses(this.selectedBatch.batch_process)
        return sortedProcesses[currentProcessOrder - 2]['status'] === 'finished'
      }
    } else {
      return false
    }
  }

  onConfirmSpecs(bp: BatchProcess): void {
    bp.process?.process_component.forEach(pc => {
      const wr: WarehouseRecord = {
        batch_process_id: Number(bp.id),
        component_id: pc.component_id,
        component_name: pc.component?.name || '',
        consumption: pc.consumption || 1,
        specification_id: this.specChoiceGroup.controls[pc.component_id].value.id,
        specification_net_price: this.specChoiceGroup.controls[pc.component_id].value.net_price,
        specification_gross_price: this.specChoiceGroup.controls[pc.component_id].value.gross_price
      };
      this.wrService.postWarehouseRecord(wr).subscribe(
        res => {
          bp.warehouse_record?.push(res);
          bp.spec_confirm = true;
          this.onSuccess('确认领料规格');
          this.specChoiceGroup.disable();
        },
        error => {
          console.log(error);
          this.onFailure('确认领料规格')
        }
      )
    });

  }

  onEditSpecs(bp: BatchProcess): void {
    const new_wr_array: WarehouseRecord[] = [];
    bp.warehouse_record?.forEach(wr => {
      wr.specification_id = this.specChoiceGroup.controls[wr.component_id].value.id;
      wr.specification_net_price = this.specChoiceGroup.controls[wr.component_id].value.net_price;
      wr.specification_gross_price = this.specChoiceGroup.controls[wr.component_id].value.gross_price;
      this.wrService.putWarehouseRecord(wr).subscribe(
        res => new_wr_array.push(res),
        error => {
          console.log(error);
          this.onFailure('修改领料规格')
        }
      )
    });
    bp.warehouse_record = new_wr_array;
    this.onSuccess('修改领料规格');
    this.specChoiceGroup.disable();
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

  removeHiddenSpecs(specs: Spec[]): Spec[] {
    return specs.filter(spec => spec.hide === false);
  }

  // openCreateWorkDialog(bp: BatchProcess, product_name: string): void {
  //   const dialogRef = this.dialog.open(CreateWorkDialogComponent, {
  //     width: environment.MEDIAN_DIALOG_WIDTH,
  //     data: {bp: bp, batch_plan_unit: this.selectedBatch?.plan_amount, employees: this.workingEmployees, product_name: product_name}
  //   });
  //   dialogRef.afterClosed().subscribe(
  //     new_work => {
  //       if (new_work) {
  //         if (!bp.work) {
  //           bp.work = [new_work];
  //         } else {
  //           bp.work.push(new_work);
  //         }
  //       }
  //     }
  //   );
  // }

  // openEditWorkDialog(work: Work, wr_array: WarehouseRecord[], unit_limit: number): void {
  //   const specWithdrawsBefore = new Map();
  //   work.work_specification?.forEach(
  //     ws => specWithdrawsBefore.set(ws.specification_id, ws.actual_amount))
  //   const dialogRef = this.dialog.open(EditWorkDialogComponent, {
  //     width: environment.MEDIAN_DIALOG_WIDTH,
  //     data: {work: work, warehouse_record: wr_array, max_amount: unit_limit}
  //   });
  //
  //   dialogRef.afterClosed().subscribe(
  //     updated_work => updated_work && this.workService.putWork(updated_work).subscribe(
  //       res => {
  //         res.work_specification?.forEach(nws => {
  //           const adjust_number = specWithdrawsBefore.get(nws.specification_id) - Number(nws.actual_amount);
  //           this.specService.adjustSpecStock(nws.specification_id, adjust_number).subscribe();
  //         });
  //         this.rerenderBatch(Number(this.selectedBatch?.id));
  //         this.onSuccess('修改工人领料');
  //       },
  //       error => {
  //         this.onFailure('修改工人领料');
  //         console.log(error);
  //       }));
  // }

  openCompleteWorkDialog(work: Work): void {
    const dialogRef = this.dialog.open(CompleteWorkDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH,
      data: {work: work}
    });

    dialogRef.afterClosed().subscribe(
      updated_work => {
        if (updated_work) {
          this.workService.putWork(updated_work).subscribe(
            res => {
              this.rerenderBatch(Number(this.selectedBatch?.id));
              this.onSuccess('确认完成');
            },
            error => {
              console.log(error);
              this.onFailure('确认完成');
              return work;
            })
        }
      }
    );
  }

  openCreateBatchDialog(): void {
    const dialogRef = this.dialog.open(CreateBatchDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH
    });
    dialogRef.afterClosed().subscribe(
      new_batch => {
        if (new_batch) {
          this.displayedBatches.push(new_batch);
          this.onSuccess('创建生产批次');
        }
      }
    )
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  checkAllWorkDone(works: Work[]): boolean {
    if (works.length <= 0) {
      return false;
    }
    return works.every(w => w.complete_unit && w.complete_unit > 0)
  }

  checkAllBatchProcessDone(bps: BatchProcess[]): boolean {
    return bps.every(bp => bp.status === 'finished');
  }

  checkAllSpecConfirmed(bp: BatchProcess): boolean {
    if (!bp.process?.process_component) {
      // no process compo needed
      return true;
    } else if (!!bp.warehouse_record) {
      // have process compo needed, have warehouse record
      return bp.warehouse_record.length === bp.process?.process_component.length
    } else {
      // have process compo needed, but no warehouse record
      return false;
    }
  }

  completeBatchProcess(complete_bp: BatchProcess): void {
    // @ts-ignore
    complete_bp.end_amount = complete_bp.work?.reduce((acc, w) => {
      return acc + Number(w.complete_unit);
    }, 0);
    complete_bp.status = 'finished';
    this.bpService.putBatchProcess(complete_bp).subscribe(
      res => {
        const next_bp = this.selectedBatch?.batch_process.find(
          bp => bp.process?.process_order === (complete_bp.process?.process_order! + 1));
        if (next_bp) {
          next_bp.start_amount = complete_bp.end_amount;
          this.bpService.putBatchProcess(next_bp).subscribe(
            new_next_bp => {
              this.rerenderBatch(complete_bp.batch_id);
              this.onSuccess('确认工艺完成');
            }
          );
        } else {
          this.rerenderBatch(complete_bp.batch_id);
          this.onSuccess('确认工艺完成');
        }
      },
      error => {
        this.onFailure('确认工艺完成');
        console.log(error)
      }
    )
  }

  forceCompleteBatchProcess(complete_bp: BatchProcess) {
    // @ts-ignore
    complete_bp.end_amount = complete_bp.start_amount;
    complete_bp.status = 'finished';
    this.bpService.putBatchProcess(complete_bp).subscribe(
      res => {
        const next_bp = this.selectedBatch?.batch_process.find(
          bp => bp.process?.process_order === (complete_bp.process?.process_order! + 1));
        if (next_bp) {
          next_bp.start_amount = complete_bp.end_amount;
          this.bpService.putBatchProcess(next_bp).subscribe(
            new_next_bp => {
              this.rerenderBatch(complete_bp.batch_id);
              this.onSuccess('强制确认');
            });
        } else {
          this.rerenderBatch(complete_bp.batch_id);
          this.onSuccess('强制确认');
        }},
      error => {
        this.onFailure('强制确认');
        console.log(error)
      }
    )
  }

  completeBatch(batch: Batch): void {
    const updated_batch = {...batch}
    updated_batch.id = updated_batch.id || 0
    updated_batch.actual_amount = batch.batch_process[batch.batch_process.length - 1].end_amount || 0
    updated_batch.status = 'finished';
    updated_batch.end = this.util.mysqlDatetimeTransformer(new Date());
    this.batchService.completeBatch(updated_batch.id, updated_batch.actual_amount).subscribe(
      res => {
        // delete from display
        const targetIdx = this.displayedBatches.findIndex(b => b.id === res.id);
        this.displayedBatches = this.displayedBatches.splice(targetIdx, 1);
        // product inventory adjustment
        this.productService.adjustProductInventory(batch.product_id, Number(batch.actual_amount)).subscribe()
        this.selectedBatch = null;
        this.onSuccess(`批次完工确认`);
      },
      error => {
        this.onFailure(`批次${batch.id}完工确认`);
        console.log(error)
      }
    )
  }

  startBatchProcess(bp: BatchProcess, batch: Batch): void {
    const updated_bp = {...bp}
    updated_bp.status = 'ongoing';
    const current_order = updated_bp.process?.process_order;
    if (current_order === 1) {
      updated_bp.start_amount = batch.plan_amount;
    } else {
      const last_bp = batch.batch_process.find(bp => bp.process?.process_order === (Number(current_order) - 1))!;
      updated_bp.start_amount = last_bp.end_amount || last_bp.start_amount;
    }
    this.bpService.putBatchProcess(updated_bp).subscribe(
      res => {
        this.rerenderBatch(Number(this.selectedBatch?.id));
        this.onSuccess('修改工艺状态');
      },
      error => {
        this.onFailure('修改工艺状态');
        console.log(error)
      }
    )
  }

  rerenderBatch(batch_id: number): void {
    this.batchService.getBatch(Number(batch_id)).subscribe(
      updated_batch => {
        const target_idx = this.displayedBatches.findIndex(b => b.id === batch_id);
        this.displayedBatches[target_idx] = {...this.displayedBatches[target_idx], ...updated_batch};
        this.selectedBatch = this.displayedBatches[target_idx];
      }
    )
  }

  sortedBatchProcesses(bp_array: BatchProcess[]): BatchProcess[] {
    return bp_array.sort((a, b) => (Number(a.process?.process_order) - Number(b.process?.process_order)))
  }

  // openAddDayInvoiceDialog(batch: Batch | null, batch_process: BatchProcess | null): void {
  //   const workingBatches = this.displayedBatches.filter(b => (b.status !== 'unstarted'));
  //   console.log(batch_process);
  //   const dialogRef = this.dialog.open(AddWorkDialogComponent, {
  //     width: environment.MEDIAN_DIALOG_WIDTH,
  //     data: {workingBatches: workingBatches, batch: batch, batchProcess: batch_process}
  //   });
  //   dialogRef.afterClosed().subscribe(
  //   );
  // }

  setBatchUrgent(selectedBatch: Batch) {
    this.batchService.putBatch({...selectedBatch, status: 'urgent'}).subscribe(
      res => {
        this.rerenderBatch(res.id!);
        this.onSuccess('加急')
      },
      error => {
        this.onFailure('加急')
        console.log(error)
      }
    )
  }

  print(element: any) {
    console.log(element);
  }

  setBatchOngoing(selectedBatch: Batch) {
    this.batchService.putBatch({...selectedBatch, status: 'ongoing'}).subscribe(
      res => {
        this.rerenderBatch(res.id!);
        this.onSuccess('加急取消')
      },
      error => {
        this.onFailure('加急取消')
        console.log(error)
      }
    )
  }

  openCancelBatchConfirm(batch: Batch) {
    const dialogRef = this.dialog.open(CancelBatchConfirmDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {batch: batch}
    });
    dialogRef.afterClosed().subscribe(
      res => {
        if (!!res) {
          this.onSuccess('取消批次');
          const target_idx = this.displayedBatches.findIndex(b => b.id === res.id);
          this.displayedBatches.splice(target_idx, 1);
          this.selectedBatch = null;
        }
      }
    );
  }

  // openDeleteWorkConfirmDialog(work: Work, bp: BatchProcess): void {
  //   const dialogRef = this.dialog.open(DeleteWorkConfirmDialogComponent, {
  //     width: environment.MEDIAN_DIALOG_WIDTH,
  //     data: {work: work}
  //   });
  //   dialogRef.afterClosed().subscribe(
  //     work_id => {if (!!work_id) {
  //       const idx = bp.work?.findIndex(w => w.id === work_id);
  //       idx && bp.work?.splice(idx, 1);
  //     }}
  //   );
  // }

  updateBatchProcessStatus(bp: BatchProcess) {
    const dialogRef = this.dialog.open(UpdateBatchProcessStatusDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH,
      data: {bp: bp, employees: this.workingEmployees, product_name: this.selectedBatch?.product_name}
    })
    dialogRef.afterClosed().subscribe(
      updated_batch => {
        this.rerenderBatch(updated_batch.batch_id);
        this.onSuccess('工艺进度更新成功');
      }
    )
  }
}
