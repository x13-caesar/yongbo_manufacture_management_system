import {Component, Inject, OnInit} from '@angular/core';
import {CompoService} from '../../shared/http-services/compo.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Compo} from '../../shared/models/compo';

class DialogData {
  compo!: Compo
}

@Component({
  selector: 'app-delete-component-dialog',
  templateUrl: './hide-component-dialog.component.html',
  styleUrls: ['./hide-component-dialog.component.scss']
})
export class HideComponentDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HideComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private compoService: CompoService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onConfirmDelete(): void {
    this.compoService.hideCompo(String(this.data.compo.id)).subscribe(
      res => {
        this.dialogRef.close(res);
      },
      error => this._snackBar.open(`配件隐藏失败`, "关闭")
    )
  }

}
