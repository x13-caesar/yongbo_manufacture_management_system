import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CompoService} from '../shared/http-services/compo.service';
import {SpecService} from '../shared/http-services/spec.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Vendor} from '../shared/models/vendor';
import {Compo, CompoCategory} from '../shared/models/compo';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {VendorService} from '../shared/http-services/vendor.service';
import {CreateVendorDialogComponent} from '../vendor-list/create-vendor-dialog/create-vendor-dialog.component';
import {environment} from '../../environments/environment';
import {MatDialog} from '@angular/material/dialog';
import {existingIdValidator} from '../shared/existing-id.directive';
import { FileService } from '../shared/http-services/file.service';
import {UploadPictureDialogComponent} from '../upload-picture-dialog/upload-picture-dialog.component';

@Component({
  selector: 'app-create-spec',
  templateUrl: './create-spec.component.html',
  styleUrls: ['./create-spec.component.scss']
})
export class CreateSpecComponent implements OnInit {
  fileToUpload!: File;
  policy: FormData = new FormData();
  uploadHost: string = '';
  uploadStatus: string = '';

  showCreateSpec: Boolean = false;

  compoGroup!: FormGroup;
  specGroup!: FormGroup;

  compos: Compo[] = [];
  compoOptions!: Observable<Compo[]>;
  selectedCompo!: FormControl
  compoCategories: CompoCategory[] = []

  vendors: Vendor[] = [];
  vendorOptions!: Observable<Vendor[]>;
  selectedVendor!: FormControl

  existingSpecIds: string[] = [];
  existingCompoIds: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public compoService: CompoService,
    public specService: SpecService,
    public vendorService: VendorService,
    public fileService: FileService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.selectedCompo = new FormControl('', Validators.required);
    this.selectedVendor = new FormControl('', Validators.required);
    this.compoGroup = this.formBuilder.group({
      id: new FormControl('', [Validators.required, existingIdValidator(this.existingCompoIds)]),
      name: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      model: new FormControl(''),
      description: new FormControl(''),
      expiration: new FormControl(''),
      as_unit: new FormControl(''),
      unit_weight: new FormControl(''),
      fill_period: new FormControl(''),
      warn_stock: new FormControl(2000, [Validators.min(0), Validators.required]),
      notice: new FormControl(''),
      picture: new FormControl(''),
    });
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
    this.specGroup = this.formBuilder.group({
      id: new FormControl('', [Validators.required, existingIdValidator(this.existingSpecIds)]),
      gross_price: new FormControl('', [Validators.required, Validators.min(0)]),
      net_price: new FormControl('', [Validators.required, Validators.min(0)]),
      use_net: new FormControl(true, [Validators.required,]),
      stock: new FormControl(0, [Validators.min(0), Validators.required]),
      unit_amount: new FormControl(0),
      blueprint: new FormControl(''),
      notice: new FormControl('')
    });

    this.specService.getExistingIds().subscribe(
      res => {
        this.existingSpecIds = res;
        this.specGroup.controls['id'].setValidators([Validators.required, existingIdValidator(this.existingSpecIds)]);
      },
      error => console.log(error)
    );

    this.compoService.getCompos().subscribe(
      res => {
        this.compos = res;
        res.forEach(compo => this.existingCompoIds.push(compo.id || ''))
      },
      error => console.log(error)
    );

    this.compoService.getCompoCategories().subscribe(
      res => this.compoCategories = res
    );

    this.vendorService.getVendors().subscribe(
      res => this.vendors = res,
      error => console.log(error)
    );

    this.compoOptions = this.selectedCompo.valueChanges
      .pipe(
        map(c => this.compoService.compoAutocompleteFilter(c, this.compos))
      );
    this.vendorOptions = this.selectedVendor.valueChanges
      .pipe(
        map(v => this.vendorService.vendorAutocompleteFilter(this.vendors, v))
      );

    this.compoGroup.controls['category'].valueChanges.subscribe(
      change => this.compoGroup.controls['id'].setValue(
        this.compoCategories.find(cc => cc.category === change)?.prefix
      ))
  }


  onCompoSubmit(form: FormGroup): void {
    console.log("Sending out the new product...")
    this.compoService.postCompo(form.value).subscribe(
      {
        next: res => {
          this.onSuccess('新配件');
          form.reset();
          this.compos.push(res);
          this.existingCompoIds.push(res.id!);
          form.controls['warn_stock'].setValue(2000);
        },
        error: err => {
          this.onFailure('新配件');
          alert(err.message);
        }})
  }

  onSpecSubmit(form: FormGroup): void {
    const spec = form.value;
    spec['component_id'] = this.selectedCompo.value.id;
    spec['vendor_id'] = this.selectedVendor.value.id;
    console.log(spec);
    this.specService.postSpec(form.value).subscribe(
      res => {
        this.onSuccess('新子类（规格）');
        form.reset();
        this.existingSpecIds.push(res.id!);
        form.controls['stock'].setValue(0);
        },
      error => {
        this._snackBar.open('新子类（规格）添加失败', "关闭");
        console.log(error);
      }
    );
  }

  openCreateVendorDialog(): void {
    const dialogRef = this.dialog.open(CreateVendorDialogComponent, {
      width: environment.MEDIAN_DIALOG_WIDTH
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.vendors.push(result);
      }
    });
  }

  onSuccess(obj: string): void {
    this._snackBar.open(`${obj}成功`, "关闭");
  }

  onFailure(obj: string): void {
    this._snackBar.open(`${obj}失败`, "关闭");
  }

  generateSpecId() {
    const new_id = this.selectedCompo.value.id + this.selectedVendor.value.id.toString().padStart(3, '0');
    this.specGroup.controls['id'].setValue(new_id);
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onClickUploadCompoPicture() {
    this.uploadStatus = 'uploading';
    this.fileService.uploadFileToOSS(
      this.fileToUpload,
      this.compoGroup.controls['id'].value,
      this.policy,
      this.uploadHost)
      .subscribe(
        res => {
          console.log("response:", res);
          this.uploadStatus = 'success';
        },
        err => {
          this.uploadStatus = 'fail';
          console.log(err)})
  }

  onClickUploadSpecPicture() {
    this.uploadStatus = 'uploading';
    this.fileService.uploadFileToOSS(
      this.fileToUpload,
      this.compoGroup.controls['id'].value,
      this.policy,
      this.uploadHost)
      .subscribe(
        res => {
          console.log("response:", res);
          this.uploadStatus = 'success';
        },
        err => {
          this.uploadStatus = 'fail';
          console.log(err)})
  }

  openUploadPictureDialog(key: string, display_name: string) {
      const dialogRef = this.dialog.open(UploadPictureDialogComponent, {
        width: environment.SMALL_DIALOG_WIDTH,
        height: '30%',
        data: {key: key, display_name: display_name}
      });
  }

}
