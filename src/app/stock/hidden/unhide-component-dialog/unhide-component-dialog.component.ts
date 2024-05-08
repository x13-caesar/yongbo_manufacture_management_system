import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CompoService} from '../../../shared/http-services/compo.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Compo} from '../../../shared/models/compo';

class DialogData {
  compo!: Compo
}

@Component({
  selector: 'app-unhide-component-dialog',
  templateUrl: './unhide-component-dialog.component.html',
  styleUrls: ['./unhide-component-dialog.component.scss']
})
export class UnhideComponentDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UnhideComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private compoService: CompoService,
    public _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onConfirmUnhide(): void {
    this.compoService.unhideCompo(String(this.data.compo.id)).subscribe(
      res => {
        this.dialogRef.close(res);
      },
      error => this._snackBar.open(`操作失败`, "关闭")
    )
  }

}
