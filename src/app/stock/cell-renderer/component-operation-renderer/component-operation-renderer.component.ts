import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ICellRendererParams} from 'ag-grid-community';
import {MatDialog} from '@angular/material/dialog';
import {Compo} from '../../../shared/models/compo';
import {UploadPictureDialogComponent} from '../../../upload-picture-dialog/upload-picture-dialog.component';
import {environment} from '../../../../environments/environment';
import {JWTTokenService} from '../../../shared/http-services/jwt-token.service';
import {EditComponentDialogComponent} from '../../edit-component-dialog/edit-component-dialog.component';
import {AddSpecDialogComponent} from '../../add-spec-dialog/add-spec-dialog.component';
import {HideComponentDialogComponent} from '../../hide-component-dialog/hide-component-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {autoFadeSnackBar} from '../../../shared/util/notifications';

@Component({
  selector: 'app-component-operation-renderer',
  templateUrl: './component-operation-renderer.component.html',
  styleUrls: ['./component-operation-renderer.component.scss']
})
export class ComponentOperationRendererComponent implements ICellRendererAngularComp {
  public params!: ICellRendererParams
  public compo: Compo

  constructor(
    private dialog: MatDialog,
    public jwtTokenService: JWTTokenService,
    public _snackBar: MatSnackBar
  ) {
  }

  agInit(params: ICellRendererParams): void {
    this.compo = ComponentOperationRendererComponent.getRowValue(params);
    this.params = params;
  }

  refresh(params: ICellRendererParams<any>): boolean {
    return false;
  }

  private static getRowValue(params: ICellRendererParams) {
    return params.data ? params.data : params.node.data
  }

  openUploadPictureDialog() {
    const dialogRef = this.dialog.open(UploadPictureDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {key: this.compo.id, display_name: this.compo.name}
    });
  }

  openEditCompoDialog() {
    const dialogRef = this.dialog.open(EditComponentDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      width: environment.MEDIAN_DIALOG_WIDTH,
      data: {compo: this.params.data}
    });
    dialogRef.afterClosed().subscribe({
        next: updated_compo => {
          if (!!updated_compo) {
            this.params.node.updateData({...updated_compo, specification: this.compo.specification});
            autoFadeSnackBar(this._snackBar, `配件 ${this.compo.id} 更新成功`, 3000)
          }
        },
      error: err => alert(err)
      }
    );
  }

  openAddSpecDialog() {
    const dialogRef = this.dialog.open(AddSpecDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {compo: this.params.data, specs: this.params.data.specification}
    });

    dialogRef.afterClosed().subscribe(
      {
        next: new_spec => {
          if (new_spec) {
            this.compo.specification.push(new_spec);
            this.params.node.setDataValue("specification", this.compo.specification);
          }
        },
        error: err => alert(err)
      }
    );
  }

  openHideCompoDialog() {
    const dialogRef = this.dialog.open(HideComponentDialogComponent, {
      width: environment.LARGE_DIALOG_WIDTH,
      data: {compo: this.params.data}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (!!res) {
        this.params.node.setDataValue("hide", true);
      }
    });
  }

  openShowImageDialog() {
    window.open(`${environment.OSS_BUCKET_URL}${this.compo.id}`, '_blank');
  }

  isEditing() {
    return this.params.api.getEditingCells().length > 0;
  }
}
