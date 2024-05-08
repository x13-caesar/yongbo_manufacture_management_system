import { Component } from '@angular/core';
import {ICellRendererParams} from 'ag-grid-community';
import {MatDialog} from '@angular/material/dialog';
import {JWTTokenService} from '../../../shared/http-services/jwt-token.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ShowPictureDialogComponent} from '../../../show-picture-dialog/show-picture-dialog.component';
import {environment} from '../../../../environments/environment';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-image-view-renderer-component',
  templateUrl: './image-view-renderer-component.component.html',
  styleUrls: ['./image-view-renderer-component.component.scss']
})
export class ImageViewRendererComponentComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams
  public key: any

  constructor(
    private dialog: MatDialog,
    public jwtTokenService: JWTTokenService,
    public _snackBar: MatSnackBar
  ) {
  }

  agInit(params: ICellRendererParams): void {
    this.key = this.params.data.id;
    this.params = params;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  openShowImageDialog() {
    const showImageDialogRef = this.dialog.open(ShowPictureDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      height: '80%',
      data: {key: this.key}
    });
  }
}
