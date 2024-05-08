import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Vendor} from '../../shared/models/vendor';
import {Spec} from '../../shared/models/spec';
import {InstockForm, InstockItem} from '../../shared/models/instock';
import {HttpClient} from '@angular/common/http';
import {VendorService} from '../../shared/http-services/vendor.service';
import {SpecService} from '../../shared/http-services/spec.service';
import {map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {autoFadeSnackBar} from '../../shared/util/notifications';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-create-instock-form',
  templateUrl: './create-instock-form.component.html',
  styleUrls: ['./create-instock-form.component.scss']
})
export class CreateInstockFormComponent {
  instockFormGroup!: FormGroup;
  itemGroup!: FormGroup;
  vendors!: Vendor[];
  vendorsInvolved!: Set<Vendor>;
  vendorOptions!: Observable<Vendor[]>;
  vendorSelected!: FormControl;
  specOption!: Observable<Spec[]>;
  specSelected!: FormControl;

  instockItems!: InstockItem[];

  countDownloadedExcel: number;

  filesLoading: boolean = false;

  constructor(
    private http: HttpClient,
    public vendorService: VendorService,
    public specService: SpecService,
    private fb: FormBuilder,
    public _snackBar: MatSnackBar,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.instockItems = [];
    this.vendorsInvolved = new Set();
    this.vendorSelected = new FormControl(null, Validators.required);
    this.specSelected = new FormControl(null, Validators.required);
    this.instockFormGroup = this.fb.group({
      create_time: new FormControl(new Date(), Validators.required),
      form_status: new FormControl('ongoing'),
      amount: new FormControl(0, [Validators.required, Validators.min(0)]),
      paid: new FormControl(false),
      note: new FormControl(null),
      instock_item: new FormControl<InstockItem[]>([])
    });
    this.itemGroup = this.fb.group({
      // specification_id: new FormControl(null, Validators.required),
      order_quantity: new FormControl(0, Validators.required),
      unit_cost: new FormControl(0, Validators.required),
      instock_date: new FormControl(null, Validators.required),
      notice: new FormControl(null)
    });
    this.http.get<Vendor[]>(`${environment.API_URL}/vendors`).subscribe({
      next: vendors => this.vendors = vendors,
      error: err => {
        alert(err.message);
        console.log(err);
      }
    });
    this.vendorOptions = this.vendorSelected.valueChanges
      .pipe(
        map(v => this.vendorService.vendorAutocompleteFilter(this.vendors, v))
      );
    this.vendorSelected.valueChanges.subscribe({
      next: vendor => {
        if (!!vendor.id) {
          this.specOption = this.specService.getSpecByVendorId(vendor.id);
        }
      }
    });
    this.specSelected.valueChanges.subscribe({
      next: spec => {
        if (!!spec) {
          this.itemGroup.controls['unit_cost'].setValue(spec.use_net ? spec.net_price : spec.gross_price);
          this.itemGroup.controls['notice'].setValue(spec.notice);
        }
      }
    });
    this.countDownloadedExcel = 0;
  }

  specDisplayFn(spec: Spec): string {
    return spec ? `${spec.component_name}（${spec.id}）` : '';
  }

  dateDisplayFn(date: string): string {
    return date ? new Date(date).toLocaleDateString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    }) : '无数据';
  }

  onSubmit() {
    const all_vendors: Vendor[] = Array.from(this.vendorsInvolved);
    const all_instock_forms: InstockForm[] = all_vendors.map(vendor => {
      const item_belongs_to = this.filterItemsByVendorId(vendor.id);
      const new_instock_form: InstockForm = {
        form_status: 'ongoing',
        paid: false,
        vendor_id: vendor.id,
        amount: item_belongs_to.reduce((prev, curr) => prev + curr.order_quantity * curr.unit_cost, 0),
        instock_item: item_belongs_to
      };
      return new_instock_form;
    });
    this.http.post<InstockForm[]>(`${environment.API_URL}/instock/multiple-form`, all_instock_forms).subscribe({
      next: async (created_forms) => {
        autoFadeSnackBar(this._snackBar, `提交采购单(${all_instock_forms.length}张)成功`, 3000);
        this.filesLoading = true;
        for (const form of created_forms) {
          this.http.get(
            `${environment.API_URL}/instock/form-in-excel?form_id=${form.form_id}`,
            {responseType: 'blob'})
            .subscribe({
              next: blob => {
                saveAs(blob, `${form.form_id}_${form.vendor_id}_${form.create_time.slice(0, 10)}.xlsx`);
                this.countDownloadedExcel += 1;
              },
              error: error => console.log(error)
            });
        }
        this.filesLoading = false;
      }
    });
  }

  filterItemsByVendorId(vendor_id: number) {
    return this.instockItems.filter(item => item.vendor_id === vendor_id);
  }

  onConfirmAddItem() {
    this.vendorsInvolved.add(this.vendorSelected.value);
    const new_item: InstockItem = {
      ...this.itemGroup.value,
      specification_id: this.specSelected.value.id,
      warehouse_quantity: 0,
      last_time: new Date(),
      name: this.specSelected.value.component_name,
      as_unit: this.specSelected.value.as_unit,
      vendor_id: this.vendorSelected.value.id
    };
    this.instockItems.push(new_item);
    // console.log(this.instockItems);
    this.itemGroup.reset();
    this.vendorSelected.reset();
    this.specSelected.reset();
  }

  copyItem(item: InstockItem) {
    this.instockItems.push({...item, order_quantity: 0, instock_date: null});
  }

  removeItem(item) {
    const idx = this.instockItems.findIndex(
      e => e.specification_id === item.specification_id
        && e.order_quantity === item.order_quantity
        && e.instock_date === item.instock_date
    );
    this.instockItems.splice(idx, 1);
  }

  goToInstockItemView() {
    this.router.navigate(['/instock-item']);
  }
}
