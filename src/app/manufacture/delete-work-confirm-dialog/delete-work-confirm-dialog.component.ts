import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BatchService} from '../../shared/http-services/batch.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Batch} from '../../shared/models/batch';
import {WorkService} from '../../shared/http-services/work.service';
import {Work} from '../../shared/models/work';

class DialogData {
  work!: Work;
}

@Component({
  selector: 'app-delete-work-confirm-dialog',
  templateUrl: './delete-work-confirm-dialog.component.html',
  styleUrls: ['./delete-work-confirm-dialog.component.scss']
})
export class DeleteWorkConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteWorkConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private workService: WorkService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  cancelBatch(work: Work) {
    if (work.id) {
      this.workService.deleteWork(work.id).subscribe(
        res => this.dialogRef.close(work.id),
        error => this.onFailure('删除记录')
      );
    }
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

}
