import { Component } from '@angular/core';
import {ICellRendererParams} from 'ag-grid-community';
import {Compo} from '../../../shared/models/compo';
import {MatDialog} from '@angular/material/dialog';
import {JWTTokenService} from '../../../shared/http-services/jwt-token.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UploadPictureDialogComponent} from '../../../upload-picture-dialog/upload-picture-dialog.component';
import {environment} from '../../../../environments/environment';
import {Spec} from '../../../shared/models/spec';
import {HideSpecConfirmDialogComponent} from '../../delete-spec-confirm-dialog/hide-spec-confirm-dialog.component';

@Component({
  selector: 'app-specification-operation-renderer',
  templateUrl: './specification-operation-renderer.component.html',
  styleUrls: ['./specification-operation-renderer.component.scss']
})
export class SpecificationOperationRendererComponent {
  public params!: ICellRendererParams
  public spec: Spec

  constructor(
    private dialog: MatDialog,
    public jwtTokenService: JWTTokenService,
    public _snackBar: MatSnackBar
  ) {
  }

  agInit(params: ICellRendererParams): void {
    this.spec = SpecificationOperationRendererComponent.getRowValue(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  private static getRowValue(params: ICellRendererParams) {
    return params.data ? params.data : params.node.data
  }

  openUploadPictureDialog() {
    const uploadPictureDialogRef = this.dialog.open(UploadPictureDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      height: '30%',
      data: {key: this.spec.id, display_name: this.spec.component_name || this.spec.id}
    });
  }

  onClickEditSpec() {
    this.params.api.startEditingCell({
      rowIndex: this.params.rowIndex,
      colKey: 'gross_price',
    })
  }

  openHideSpecDialog() {
    const dialogRef = this.dialog.open(HideSpecConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: environment.LARGE_DIALOG_WIDTH,
      data: {spec: this.spec}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res) {
        this.params.node.setDataValue("hide", true);
      }
    });
  }

  openShowImageDialog() {
    window.open(`${environment.OSS_BUCKET_URL}${this.spec.id}`, '_blank');
  }

  isEditing() {
    return this.params.api.getEditingCells().length > 0
  }
}
