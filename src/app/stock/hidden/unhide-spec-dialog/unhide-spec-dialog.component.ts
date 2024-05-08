import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Spec} from '../../../shared/models/spec';
import {SpecService} from '../../../shared/http-services/spec.service';

class DialogData {
  spec!: Spec
}

@Component({
  selector: 'app-unhide-spec-dialog',
  templateUrl: './unhide-spec-dialog.component.html',
  styleUrls: ['./unhide-spec-dialog.component.scss']
})
export class UnhideSpecDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UnhideSpecDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private specService: SpecService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onConfirmUnhide(): void {
    this.specService.unhideSpec(String(this.data.spec.id)).subscribe(
      res => {
        this.dialogRef.close(res);
      },
      error => this._snackBar.open(`操作失败`, "关闭")
    )
  }


}
