import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {environment} from '../../environments/environment';

class DialogData {
  key!: string;
  display_name!: string;
}

@Component({
  selector: 'app-show-picture-dialog',
  templateUrl: './show-picture-dialog.component.html',
  styleUrls: ['./show-picture-dialog.component.scss']
})
export class ShowPictureDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowPictureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
  }

  onClickDownload(): void {
    window.open(`${environment.OSS_BUCKET_URL}${this.data.key}`, '_blank');
  }

}
