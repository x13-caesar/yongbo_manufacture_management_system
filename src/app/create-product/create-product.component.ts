import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../shared/http-services/product.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Product} from '../shared/models/product';
import {Compo} from '../shared/models/compo';
import {Observable} from 'rxjs';
import {CompoService} from '../shared/http-services/compo.service';
import {map} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {Process} from '../shared/models/process';
import {ProcessComponent} from '../shared/models/process-component';
import {ActivatedRoute, Router} from '@angular/router';
import {ProcessService} from '../shared/http-services/process.service';
import {existingOrderValidator} from '../shared/existing-order.directive';
import {existingIdValidator} from '../shared/existing-id.directive';
import {FileService} from '../shared/http-services/file.service';
import {ProductCategory} from '../shared/models/product-category';
import {ProductCategoryService} from '../shared/http-services/product-category.service';
import {environment} from '../../environments/environment';
import {AddProductCategoryDialogComponent} from './add-product-category-dialog/add-product-category-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  loadingFlag: boolean = false;

  productGroup!: FormGroup
  newProduct!: Product;

  existingProductIds: string[] = [];

  fileToUpload!: File;
  policy: FormData = new FormData();
  uploadHost: string = '';
  uploadStatus: string = '';

  productCategories: ProductCategory[] = [];

  processGroup!: FormGroup;
  processOfProduct: Process[] = [];

  processCompoGroup!: FormGroup;
  composOfProcess: Compo[] = [];

  compos: Compo[] = [];
  compoOptions!: Observable<Compo[]>;
  selectedCompo = new FormControl();

  // MAT chip list params
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('compoInput') compoInput!: ElementRef<HTMLInputElement>;
  public editProductId: string = '';
  public originProductId: string = '';
  public newProductId: string = ''

  constructor(
    public dialog: MatDialog,
    private productService: ProductService,
    public processService: ProcessService,
    private productCategoryService: ProductCategoryService,
    private compoService: CompoService,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
  ) { }

  ngOnInit(): void {
    this.editProductId = this.route.snapshot.paramMap.get('pid') || '';
    this.originProductId = this.route.snapshot.paramMap.get('origin_id') || '';
    this.newProductId = this.route.snapshot.paramMap.get('new_id') || '';
    this.loadingFlag = true; // start loading, change loading flag to true
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
    this.productCategoryService.getAllProductCategories().subscribe(res => {
      this.productCategories = res},
        error => {console.log(error)}
    );
    this.productService.getExistingProductIdsAndNames().subscribe(
      res => {
      res.forEach(r => this.existingProductIds.push(r.id || ''));
      this.loadingFlag = false;
    },
        err => {
      console.log(err);
      this.loadingFlag = false;
    })
    this.productGroup = this.formBuilder.group({
      id: new FormControl('', [
        Validators.required,
        existingIdValidator(this.existingProductIds),
        Validators.maxLength(16)]),
      name: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required),
      description: new FormControl(''),
      inventory: new FormControl(0, Validators.min(0)),
      custom: new FormControl(''),
      notice: new FormControl(''),
      picture: new FormControl('')
    });
    this.processGroup = this.formBuilder.group({
      process_name: new FormControl('', Validators.required),
      process_order: new FormControl(1, [Validators.required, Validators.min(1), existingOrderValidator(this.processOfProduct.map(p => p.process_order))]),
      unit_pay: new FormControl(null, [Validators.required, Validators.min(0)]),
      notice: new FormControl('')
    });
    this.processCompoGroup = this.formBuilder.group({
      component_id: new FormControl('', Validators.required),
      attrition_rate: new FormControl(0.001)
    });
    this.productGroup.valueChanges.subscribe(product => this.newProduct = {...this.newProduct, ...product});
    this.compoService.getCompos().subscribe(
      res => {
        this.compos = res;
      },
      error => console.log(error)
    );
    this.compoOptions = this.selectedCompo.valueChanges
      .pipe(
        map((c : string | null) => c ? this.compoAutocompleteFilter(c) : this.compos.slice())
      );
    if (this.editProductId || this.originProductId) {
      this.loadingFlag = true; // start loading, change loading flag to true
      this.productService.getProductById(this.editProductId || this.originProductId).subscribe(
        target_prod => {
          target_prod.process?.forEach(p => p.process_component.forEach(pc => pc.component_name = pc.component?.name));
          this.processGroup.controls['process_order'].setValue((target_prod.process?.length || 0) + 1);
          this.newProduct = target_prod;
          this.processOfProduct = target_prod.process || [];
          this.processGroup.controls['process_order'].setValidators(
            [Validators.required, Validators.min(1), existingOrderValidator(this.getExistingOrders())])
          delete target_prod.process;
          this.productGroup.setValue({
            id: target_prod.id,
            name: target_prod.name,
            category: target_prod.category,
            description: target_prod.description,
            inventory: target_prod.inventory,
            custom: target_prod.custom,
            notice: target_prod.notice,
            picture: target_prod.picture
          });
          if (this.newProductId) {
            this.productGroup.controls['id'].setValue(this.newProductId);
          }
          this.loadingFlag = false;
        },
        err => {console.log(err); this.loadingFlag = false;}
      );
      this.originProductId && this.productGroup.controls['id'].setValue(this.originProductId);
      this.editProductId && this.productGroup.controls['id'].disable();
    }
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0];
  }

  onClickUploadPicture() {
    this.uploadStatus = 'uploading';
    this.fileService.uploadFileToOSS(
      this.fileToUpload,
      this.productGroup.controls['id'].value,
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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      // @ts-ignore
      this.composOfProcess.push(value);
    }

    this.selectedCompo.setValue(null);
  }

  remove(compo: Compo): void {
    const index = this.composOfProcess.indexOf(compo);

    if (index >= 0) {
      this.composOfProcess.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.composOfProcess.push(event.option.value);
    this.compoInput.nativeElement.value = '';
    this.selectedCompo.setValue(null);
  }

  removeProcess(process: Process): void {
    const index = this.processOfProduct.indexOf(process);
    if (index >= 0) {
      this.processOfProduct.splice(index, 1);
      this.processGroup.controls['process_order'].setValue(this.processOfProduct.length + 1);
      this.processGroup.controls['process_order'].setValidators(
        [Validators.required, Validators.min(1), existingOrderValidator(this.getExistingOrders())])
    }
  }

  onProcessSubmit(form: FormGroup): void {
    const newProcess: Process = {...form.value, product: this.productGroup.controls['id'].value};
    newProcess.process_component = [];
    this.composOfProcess.forEach(
      compo => {
        const existingIdx = newProcess.process_component.findIndex(pc => pc.component_id === compo.id)
        if (existingIdx >= 0) {
          newProcess.process_component[existingIdx].consumption += 1
        } else {
          const pc: ProcessComponent = {
            consumption: 1,
            component_id: compo.id || '',
            attrition_rate: 0.001,
            component_name: compo.name
          }
          newProcess.process_component.push(pc);
        }
      });
    this.processOfProduct.push(newProcess);
    this.processGroup.reset();
    this.selectedCompo.reset();
    this.composOfProcess = [];
    this.processGroup.controls['process_order'].setValue(this.processOfProduct.length + 1)
    this.processGroup.controls['process_order'].setValidators([Validators.required, Validators.min(1),
      existingOrderValidator(this.getExistingOrders())])
  }

  getExistingOrders(): number[] {
    return this.processOfProduct.map(p => p.process_order);
  }

  onFinalSubmit(): void {
    this.newProduct = {...this.newProduct, ...this.productGroup.value};
    this.newProduct.process = this.processService.sortedProcesses(this.processOfProduct);
    this.productService.postProduct(this.newProduct).subscribe(
        res => {
          this.onSuccess('创建产品');
          this.productGroup.reset();
          this.productGroup.reset();
          this.processOfProduct = [];
          this.composOfProcess = [];
        },
        error => this.onFailure('创建产品')
      )
  }

  onConfirmEdit() {
    this.newProduct = {...this.newProduct, ...this.productGroup.value};
    this.newProduct.process = this.processService.sortedProcesses(this.processOfProduct);
    this.productService.putProduct(this.newProduct).subscribe(
      res => {
        this.onSuccess('编辑产品信息');
        this.router.navigateByUrl('/inventory');
      },
      error => this.onFailure('编辑产品信息')
    )
  }

  onSuccess(eventString: string): void {
    this._snackBar.open(`${eventString}成功`, "关闭");
  }

  onFailure(eventString: string): void {
    this._snackBar.open(`${eventString}失败`, "关闭");
  }

  compoAutocompleteFilter(value: string): Compo[] {
    return this.compos.filter(c => c.name.includes(value) || c.id?.includes(value));
  }

  compoDisplayFn(compo: Compo): string {
    return compo && compo.name ? `${compo.name} | ${compo.id}` : '';
  }


  editProcess(process: Process) {
    const index = this.processOfProduct.indexOf(process);
    if (index >= 0) {
      this.processOfProduct.splice(index, 1);
    }
    const pcs = process.process_component;
    this.processGroup.setValue({
      process_name: process.process_name,
      process_order: process.process_order,
      unit_pay: process.unit_pay,
      notice: process.notice,
    });
    this.processGroup.controls['process_order'].setValidators([Validators.required, Validators.min(1),
      existingOrderValidator(this.getExistingOrders())])
    this.processGroup.controls['process_order'].setErrors(null);
    this.composOfProcess = pcs.map(pc => {
      const c: Compo = {
        id: pc.component_id,
        name: pc.component_name || '',
        category: '',
        warn_stock: 0,
      };
      return c
    });
    console.log("Product Form Group Validation:", this.productGroup.valid);
    console.log("Process From Group Validation:", this.processGroup.valid);
  }

  rearrangeProcess() {
    this.processOfProduct = this.processService.sortedProcesses(this.processOfProduct)
    let count = 1;
    this.processOfProduct.forEach(p => {
      p.process_order = count;
      count++;
    });
    this.onSuccess('重排序');
  }

  moveProcessUp(process: Process) {
    const initOrder = process.process_order;
    const idx = this.processOfProduct.indexOf(process);
    const upOrder = this.processOfProduct[idx-1].process_order;
    this.processOfProduct[idx].process_order = upOrder;
    this.processOfProduct[idx-1].process_order = initOrder;
    this.processService.sortedProcesses(this.processOfProduct);
  }

  moveProcessDown(process: Process) {
    const initOrder = process.process_order;
    const idx = this.processOfProduct.indexOf(process);
    const downOrder = this.processOfProduct[idx+1].process_order;
    this.processOfProduct[idx].process_order = downOrder;
    this.processOfProduct[idx+1].process_order = initOrder;
    this.processService.sortedProcesses(this.processOfProduct);
  }

  openAddProductCategoryDialog(): void {
    const dialogRef = this.dialog.open(AddProductCategoryDialogComponent, {
      width: environment.SMALL_DIALOG_WIDTH,
      data: {category_names: this.productCategories.map(c => c.category)}
    });
    dialogRef.afterClosed().subscribe(
      new_product_category => {
        if (!!new_product_category) {
          this.productCategories.push(new_product_category);
          this._snackBar.open("添加成功", "关闭");
        }

      }
    );
  }
}
