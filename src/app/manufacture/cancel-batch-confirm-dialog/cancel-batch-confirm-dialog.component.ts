import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProductService} from '../../shared/http-services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Batch} from '../../shared/models/batch';
import {BatchService} from '../../shared/http-services/batch.service';

class DialogData {
  batch!: Batch
}

@Component({
  selector: 'app-cancel-batch-confirm-dialog',
  templateUrl: './cancel-batch-confirm-dialog.component.html',
  styleUrls: ['./cancel-batch-confirm-dialog.component.scss']
})
export class CancelBatchConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CancelBatchConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private batchService: BatchService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  cancelBatch(batch: Batch) {
    this.batchService.putBatch({...batch, status: 'cancelled'}).subscribe(
      res => this.dialogRef.close(batch),
      error => this.onFailure('取消批次')
    )
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }
}
