import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileService} from '../shared/http-services/file.service';

class DialogData {
  key!: string;
  display_name!: string;

}


@Component({
  selector: 'app-upload-picture-dialog',
  templateUrl: './upload-picture-dialog.component.html',
  styleUrls: ['./upload-picture-dialog.component.scss']
})
export class UploadPictureDialogComponent implements OnInit {

  fileToUpload!: File;
  policy: FormData = new FormData();
  uploadHost: string = '';
  uploadStatus: string = '';

  @ViewChild('fileUpload') fileUploadInput!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<UploadPictureDialogComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.fileService.getPolicy().subscribe(
      response => {
        this.uploadHost = response.host;
        this.policy.append('bucket', response.bucket);
        this.policy.append('OSSAccessKeyId', response.accessid);
        this.policy.append('policy', response.policy);
        this.policy.append('signature', response['signature']);
        this.policy.append('success_action_status', '200');
      },
      error => {console.log(error)})
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onClickUploadPicture() {
    this.uploadStatus = 'uploading';
    this.fileService.uploadFileToOSS(
      this.fileToUpload,
      this.data.key,
      this.policy,
      this.uploadHost)
      .subscribe({
        next: res => {
          console.log(res);
          this.uploadStatus = 'success';
        },
        error: err =>{
          this.uploadStatus = 'fail';
          alert(err)
        }
        })
  }

}
