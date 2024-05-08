import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SpecService} from '../../shared/http-services/spec.service';
import {Spec} from '../../shared/models/spec';
import {autoFadeSnackBar} from '../../shared/util/notifications';

class DialogData {
  spec!: Spec;
}

@Component({
  selector: 'app-delete-spec-confirm-dialog',
  templateUrl: './hide-spec-confirm-dialog.component.html',
  styleUrls: ['./hide-spec-confirm-dialog.component.scss']
})
export class HideSpecConfirmDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HideSpecConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private specService: SpecService,
    public _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  onConfirmHide(): void {
    this.specService.hideSpec(String(this.data.spec.id)).subscribe(
      {
        next: res => {
          this.dialogRef.close(res);
          autoFadeSnackBar(this._snackBar, '隐藏规格成功', 3000)
        },
        error: error => autoFadeSnackBar(this._snackBar, '隐藏规格失败', 3000)
      }
    );
  }

}
