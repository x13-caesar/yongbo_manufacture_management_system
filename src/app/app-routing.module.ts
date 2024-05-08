import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OverviewComponent} from './overview/overview.component';
import {InventoryComponent} from './inventory/inventory.component';
import {StockComponent} from './stock/stock.component';
import {ManufactureComponent} from './manufacture/manufacture.component';
import {AuthorizeGuard} from './auth.guard';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {CreateProductComponent} from './create-product/create-product.component';
import {CreateSpecComponent} from './create-spec/create-spec.component';
import {TransmissionComponent} from './transmission/transmission.component';
import {VendorListComponent} from './vendor-list/vendor-list.component';
import {HistoryComponent} from './manufacture/history/history.component';
import {EmployeeComponent} from './employee/employee.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {BuyerListComponent} from './buyer-list/buyer-list.component';
import {SalaryComponent} from './salary/salary.component';
import {AdminGuard} from './admin.guard';
import {DeprecatedComponent} from './inventory/deprecated/deprecated.component';
import {BatchSummaryComponent} from './manufacture/batch-summary/batch-summary.component';
import {HiddenComponentComponent} from './stock/hidden/hidden-component/hidden-component.component';
import {HiddenSpecComponent} from './stock/hidden/hidden-spec/hidden-spec.component';
import {HiddenEmployeeComponent} from './employee/hidden-employee/hidden-employee.component';
import { OperationComponent } from './operation/operation.component';
import {DeliverySummaryComponent} from './delivery/monthly-summary/delivery-summary.component';
import {WorkRecordComponent} from './salary/work-record/work-record.component';
import {InstockFormListComponent} from './purchase/instock-form-list/instock-form-list.component';
import {InstockItemListComponent} from './purchase/instock-item-list/instock-item-list.component';
import {HistoricalInstockFormListComponent} from './purchase/historical-instock-form-list/historical-instock-form-list.component';
import {CreateInstockFormComponent} from './purchase/create-instock-form/create-instock-form.component';
import {HistoricalInstockRecordListComponent} from './purchase/historical-instock-record-list/historical-instock-record-list.component';
import {UpdatePurchaseInfoComponent} from './purchase/update-purchase-info/update-purchase-info.component';

const routes: Routes = [
  {
    path: 'app',
    component: AppComponent,
    canActivate: [AuthorizeGuard]
  },
  { path: 'overview', component: OverviewComponent, canActivate: [AuthorizeGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [AuthorizeGuard] },
  { path: 'stock', component: StockComponent, canActivate: [AuthorizeGuard] },
  { path: 'stock/warn/:warn_compo_id', component: StockComponent, canActivate: [AuthorizeGuard] },
  { path: 'manufacture', component: ManufactureComponent, canActivate: [AuthorizeGuard] },
  { path: 'manufacture/:batch_id', component: ManufactureComponent, canActivate: [AuthorizeGuard] },
  { path: 'batch-summary/:bid', component: BatchSummaryComponent, canActivate: [AuthorizeGuard] },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [AuthorizeGuard]
  },
  { path: 'employee', component: EmployeeComponent, canActivate: [AuthorizeGuard, AdminGuard] },
  { path: 'hidden-employee', component: HiddenEmployeeComponent, canActivate: [AuthorizeGuard, AdminGuard] },
  { path: 'instock-item', component: InstockItemListComponent, canActivate: [AuthorizeGuard]},
  { path: 'instock-form', component: InstockFormListComponent, canActivate: [AuthorizeGuard]},
  { path: 'new-instock-form', component: CreateInstockFormComponent, canActivate: [AuthorizeGuard, AdminGuard]},
  { path: 'historical-instock-form', component: HistoricalInstockFormListComponent, canActivate: [AuthorizeGuard]},
  { path: 'historical-instock-record-list', component: HistoricalInstockRecordListComponent, canActivate: [AuthorizeGuard]},
  { path: 'company-info', component: UpdatePurchaseInfoComponent, canActivate: [AuthorizeGuard, AdminGuard]},
  { path: 'salary', component: SalaryComponent, canActivate: [AuthorizeGuard, AdminGuard]},
  { path: 'work-record', component: WorkRecordComponent, canActivate: [AuthorizeGuard]},
  {
    path: 'delivery',
    component: DeliveryComponent,
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'delivery-summary',
    component: DeliverySummaryComponent,
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'buyer',
    component: BuyerListComponent,
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'vendors',
    component: VendorListComponent,
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'create-product', component: CreateProductComponent, canActivate: [AuthorizeGuard] },
  { path: 'edit-product/:pid', component: CreateProductComponent, canActivate: [AuthorizeGuard] },
  { path: 'copy-product/:origin_id/:new_id', component: CreateProductComponent, canActivate: [AuthorizeGuard] },
  { path: 'deprecated', component: DeprecatedComponent, canActivate: [AuthorizeGuard] },
  { path: 'hidden-compo', component: HiddenComponentComponent, canActivate: [AuthorizeGuard] },
  { path: 'hidden-spec', component: HiddenSpecComponent, canActivate: [AuthorizeGuard] },
  {
    path: 'create-spec',
    component: CreateSpecComponent,
    canActivate: [AuthorizeGuard]
  },
  {
    path: 'operations',
    component: OperationComponent,
    canActivate: [AuthorizeGuard, AdminGuard]
  },
  {path: 'transmission/:error', component: TransmissionComponent},
  { path: '',   redirectTo: '/overview', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
