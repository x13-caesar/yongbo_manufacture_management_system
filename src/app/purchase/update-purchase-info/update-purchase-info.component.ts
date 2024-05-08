import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {autoFadeSnackBar} from '../../shared/util/notifications';
import {_MatSnackBarBase, MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-purchase-info',
  templateUrl: './update-purchase-info.component.html',
  styleUrls: ['./update-purchase-info.component.scss']
})
export class UpdatePurchaseInfoComponent {
  companyForm: FormGroup;
  kaipiaoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public _snackBar: MatSnackBar,
  ) {
    this.companyForm = this.formBuilder.group({
      '公司名称': ['', Validators.required],
      '收货地址': ['', Validators.required],
      '收货联系人': ['', Validators.required],
      '电话': ['', Validators.required],
      '传真': ['', Validators.required],
      '邮编': ['', Validators.required]
    });
    this.kaipiaoForm = this.formBuilder.group({
      '公司名称': ['', Validators.required],
      '税号': ['', Validators.required],
      '开户行': ['', Validators.required],
      '账户': ['', Validators.required],
      '地址': ['', Validators.required],
      '电话': ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.http.get(`${environment.API_URL}/business/company-info`).subscribe((data: any) => {
      console.log(data);
      this.companyForm.setValue(data);
    });
    this.http.get(`${environment.API_URL}/business/kaipiao-info`).subscribe((data: any) => {
      console.log(data);
      this.kaipiaoForm.setValue(data);
    });
  }

  onCompanyInfoSubmit(): void {
    this.http.put(`${environment.API_URL}/business/company-info`, this.companyForm.value).subscribe(response => {
      autoFadeSnackBar(this._snackBar, "成功更新公司信息", 3000)
    });
  }

  onKaipiaoInfoSubmit(): void {
    this.http.put(`${environment.API_URL}/business/kaipiao-info`, this.kaipiaoForm.value).subscribe(response => {
      autoFadeSnackBar(this._snackBar, "成功更新开票信息", 3000)
    });
  }
}
