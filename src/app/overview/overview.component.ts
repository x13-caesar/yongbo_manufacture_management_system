import { Component, OnInit } from '@angular/core';
import {BatchService} from '../shared/http-services/batch.service';
import {OperationService} from '../shared/http-services/operation.service';
import {Batch} from '../shared/models/batch';
import {ProductService} from '../shared/http-services/product.service';
import {MatTableDataSource} from '@angular/material/table';
import {Compo} from '../shared/models/compo';
import {CompoService} from '../shared/http-services/compo.service';
import {Operation} from '../shared/models/operation';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  loadingFlags: boolean[] = Array(7).fill(false);

  urgent_batches!: Batch[];
  ongoing_batches!: Batch[];
  plan_batches!: Batch[];
  recent_finished_batches!: Batch[];

  compos: Compo[] = [];
  displayCompos: Compo[] = [];

  operations: Operation[] = [];

  constructor(
    private batchService: BatchService,
    private productService: ProductService,
    private operationService: OperationService,
    private compoService: CompoService,
  ) { }

  ngOnInit(): void {
    this.loadingFlags[0] = true;  // set pos 0
    this.batchService.autoUpdateBatchStatus().subscribe(
      res => {
        if (res.success) {
          this.loadingFlags[3] = true;
          this.batchService.getBatchesByStatus('urgent').subscribe(
            batches => {
              this.urgent_batches = batches;
              this.urgent_batches.forEach(b => {
                this.productService.getProductNameById(b.product_id).subscribe(
                  res => {
                    b.product_name = res.name;
                    this.loadingFlags[3] = false;
                  }
                )})},
            error => {console.log(error); this.loadingFlags[3] = false;}
          );
          this.loadingFlags[4] = true;
          this.batchService.getBatchesByStatus('ongoing').subscribe(
            batches => {
              this.ongoing_batches = batches;
              this.ongoing_batches.forEach(b => {
                this.productService.getProductNameById(b.product_id).subscribe(
                  res => {
                    b.product_name = res.name;
                    this.loadingFlags[4] = false;
                  }
                )})},
            error => {console.log(error); this.loadingFlags[4] = false;}
          );
          this.loadingFlags[5] = true;
          this.batchService.getBatchesByStatus('unstarted').subscribe(
            batches => {
              this.plan_batches = batches;
              this.plan_batches.forEach(b => {
                this.productService.getProductNameById(b.product_id).subscribe(
                  res => {
                    b.product_name = res.name;
                    this.loadingFlags[5] = false;
                  }
                );})},
            error => {console.log(error); this.loadingFlags[5] = false;}
            );
          this.loadingFlags[6] = true;
          this.batchService.getRecentFinishedBatches().subscribe(
          res => {
            this.recent_finished_batches = res;
            this.recent_finished_batches.forEach(b => {
              this.productService.getProductNameById(b.product_id).subscribe(
                res => {
                  b.product_name = res.name;
                  this.loadingFlags[6] = false;
                }
              );})
          },
          error => {console.log(error); this.loadingFlags[6] = false;}
        );
        this.loadingFlags[0] = false; // end pos 0
        }
      },
      error => {
        console.log(error);
        this.loadingFlags[0] = false; // end pos 0
      });
    this.loadingFlags[1] = true; // set pos 1
    this.compoService.getCompos().subscribe(
      res => {
        this.compos = res;
        this.checkWarns();
        this.loadingFlags[1] = false; // end pos 1
      },
      error => {
        console.log(error);
        this.loadingFlags[1] = false; // end pos 1
      }
    );
    this.loadingFlags[2] = true; // set pos 2
    this.operationService.getRecentOperations().subscribe(
      res => {
        this.operations = res;
        this.loadingFlags[2] = false; // end pos 2
      },
      error => {
        console.log(error);
        this.loadingFlags[2] = false; // end pos 2
      }
    );
  }

  checkLoadingFinished(): boolean {
    // if all loading flags are false, we're good to go
    return this.loadingFlags.every(flag => !flag)
  }

  checkWarns(): void {
    this.displayCompos = this.compos.filter(compo => this.getTotalStock(compo) < compo.warn_stock);
  }

  getTotalStock(compo: Compo): number {
    return Number(compo.specification?.reduce((acc, spec) => acc + spec.stock, 0));
  }

}
