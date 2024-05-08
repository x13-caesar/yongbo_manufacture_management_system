import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header.component';
import {MatDividerModule} from '@angular/material/divider';
import {OverviewComponent} from './overview/overview.component';
import {TransmissionComponent} from './transmission/transmission.component';
import {ManufactureComponent} from './manufacture/manufacture.component';
import {InventoryComponent} from './inventory/inventory.component';
import {BatchCompleteDialogComponent} from './manufacture/batch-complete-dialog/batch-complete-dialog.component';
import {CreateSpecComponent} from './create-spec/create-spec.component';
import {CreateProductComponent} from './create-product/create-product.component';
import {StockComponent} from './stock/stock.component';
import {PullInDialogComponent} from './stock/pull-in-dialog/pull-in-dialog.component';
import {LoginComponent} from './login/login.component';
import {AccountComponent} from './account/account.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomStyleModule} from './shared/custom-style.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {OperationComponent} from './operation/operation.component';
import {VendorListComponent} from './vendor-list/vendor-list.component';
import {CreateVendorDialogComponent} from './vendor-list/create-vendor-dialog/create-vendor-dialog.component';
import {CreateWorkDialogComponent} from './manufacture/create-work-dialog/create-work-dialog.component';
import {EditWorkDialogComponent} from './manufacture/edit-work-dialog/edit-work-dialog.component';
import {CompleteWorkDialogComponent} from './manufacture/complete-work-dialog/complete-work-dialog.component';
import {CreateBatchDialogComponent} from './manufacture/create-batch-dialog/create-batch-dialog.component';
import {HistoryComponent} from './manufacture/history/history.component';
import {EmployeeComponent} from './employee/employee.component';
import {EditComponentDialogComponent} from './stock/edit-component-dialog/edit-component-dialog.component';
import {HideComponentDialogComponent} from './stock/hide-component-dialog/hide-component-dialog.component';
import {EditSpecDialogComponent} from './stock/edit-spec-dialog/edit-spec-dialog.component';
import {CreateEmployeeDialogComponent} from './employee/create-employee-dialog/create-employee-dialog.component';
import {DeliveryComponent} from './delivery/delivery.component';
import {CreateDeliveryDialogComponent} from './delivery/create-delivery-dialog/create-delivery-dialog.component';
import {BuyerListComponent} from './buyer-list/buyer-list.component';
import {CreateBuyerDialogComponent} from './buyer-list/create-buyer-dialog/create-buyer-dialog.component';
import {EditProductDialogComponent} from './inventory/edit-product-dialog/edit-product-dialog.component';
import {SalaryComponent} from './salary/salary.component';
import {CreateSalaryForOneDialogComponent} from './salary/create-salary-for-one-dialog/create-salary-for-one-dialog.component';
import {CopyProductDialogComponent} from './inventory/copy-product-dialog/copy-product-dialog.component';
import {ConfirmDeprecateDialogComponent} from './inventory/confirm-deprecate-dialog/confirm-deprecate-dialog.component';
import {DeprecatedComponent} from './inventory/deprecated/deprecated.component';
import {BatchSummaryComponent} from './manufacture/batch-summary/batch-summary.component';
import {AddSpecDialogComponent} from './stock/add-spec-dialog/add-spec-dialog.component';
import {WorkRecordComponent} from './salary/work-record/work-record.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {CancelBatchConfirmDialogComponent} from './manufacture/cancel-batch-confirm-dialog/cancel-batch-confirm-dialog.component';
import {ConfirmEmployeeLeaveDialogComponent} from './employee/confirm-employee-leave-dialog/confirm-employee-leave-dialog.component';
import {HideSpecConfirmDialogComponent} from './stock/delete-spec-confirm-dialog/hide-spec-confirm-dialog.component';
import {HiddenComponentComponent} from './stock/hidden/hidden-component/hidden-component.component';
import {UnhideComponentDialogComponent} from './stock/hidden/unhide-component-dialog/unhide-component-dialog.component';
import {HiddenSpecComponent} from './stock/hidden/hidden-spec/hidden-spec.component';
import {UnhideSpecDialogComponent} from './stock/hidden/unhide-spec-dialog/unhide-spec-dialog.component';
import {UniversalAppInterceptor} from './shared/interceptors/universal-app-interceptor';
import {HiddenEmployeeComponent} from './employee/hidden-employee/hidden-employee.component';
import {ConfirmEmployeeResumeDialogComponent} from './employee/confirm-employee-resume-dialog/confirm-employee-resume-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ShowPictureDialogComponent} from './show-picture-dialog/show-picture-dialog.component';
import {UploadPictureDialogComponent} from './upload-picture-dialog/upload-picture-dialog.component';
import {AddProductCategoryDialogComponent} from './create-product/add-product-category-dialog/add-product-category-dialog.component';
import {DeleteWorkConfirmDialogComponent} from './manufacture/delete-work-confirm-dialog/delete-work-confirm-dialog.component';
import {DeliverySummaryComponent} from './delivery/monthly-summary/delivery-summary.component';
import {UpdateBatchProcessStatusDialogComponent} from './manufacture/update-batch-process-status-dialog/update-batch-process-status-dialog.component';
import {AgGridModule} from 'ag-grid-angular';
import {InstockFormListComponent} from './purchase/instock-form-list/instock-form-list.component';
import {InstockDetailDialogComponent} from './purchase/instock-detail-dialog/instock-detail-dialog.component';
import {InstockItemListComponent} from './purchase/instock-item-list/instock-item-list.component';
import {InstockItemOperationRendererComponent} from './purchase/cell-renderer/instock-item-operation-renderer/instock-item-operation-renderer.component';
import {InstockFormOperationRendererComponent} from './purchase/cell-renderer/instock-form-operation-renderer/instock-form-operation-renderer.component';
import {HistoricalInstockFormListComponent} from './purchase/historical-instock-form-list/historical-instock-form-list.component';
import {InstockRecordViewDialogComponent} from './purchase/instock-record-view-dialog/instock-record-view-dialog.component';
import {NewInstockEventDialogComponent} from './purchase/new-instock-event-dialog/new-instock-event-dialog.component';
import {InstockEventCellRendererComponent} from './purchase/cell-renderer/instock-event-cell-renderer/instock-event-cell-renderer.component';
import {InstockFormSingleViewDialogComponent} from './purchase/instock-form-single-view-dialog/instock-form-single-view-dialog.component';
import {CreateInstockFormComponent} from './purchase/create-instock-form/create-instock-form.component';
import {DateRangeComponent} from './shared/inputs/date-range/date-range.component';
import {ConfirmFinishFormDialogComponent} from './purchase/cell-renderer/instock-form-operation-renderer/confirm-finish-form-dialog/confirm-finish-form-dialog.component';
import {HistoricalInstockRecordListComponent} from './purchase/historical-instock-record-list/historical-instock-record-list.component';
import {ComponentOperationRendererComponent} from './stock/cell-renderer/component-operation-renderer/component-operation-renderer.component';
import {SpecListDialogComponent} from './stock/spec-list-dialog/spec-list-dialog.component';
import {SpecificationOperationRendererComponent} from './stock/cell-renderer/specification-operation-renderer/specification-operation-renderer.component';
import {ImageViewRendererComponentComponent} from './stock/cell-renderer/image-view-renderer-component/image-view-renderer-component.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { UpdatePurchaseInfoComponent } from './purchase/update-purchase-info/update-purchase-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    OverviewComponent,
    TransmissionComponent,
    ManufactureComponent,
    InventoryComponent,
    BatchCompleteDialogComponent,
    CreateSpecComponent,
    CreateProductComponent,
    StockComponent,
    PullInDialogComponent,
    LoginComponent,
    AccountComponent,
    OperationComponent,
    VendorListComponent,
    CreateVendorDialogComponent,
    CreateWorkDialogComponent,
    EditWorkDialogComponent,
    CompleteWorkDialogComponent,
    CreateBatchDialogComponent,
    HistoryComponent,
    EmployeeComponent,
    EditComponentDialogComponent,
    HideComponentDialogComponent,
    EditSpecDialogComponent,
    CreateEmployeeDialogComponent,
    DeliveryComponent,
    DeliverySummaryComponent,
    CreateDeliveryDialogComponent,
    BuyerListComponent,
    CreateBuyerDialogComponent,
    EditProductDialogComponent,
    SalaryComponent,
    CreateSalaryForOneDialogComponent,
    CopyProductDialogComponent,
    ConfirmDeprecateDialogComponent,
    DeprecatedComponent,
    BatchSummaryComponent,
    AddSpecDialogComponent,
    WorkRecordComponent,
    CancelBatchConfirmDialogComponent,
    ConfirmEmployeeLeaveDialogComponent,
    HideSpecConfirmDialogComponent,
    HiddenComponentComponent,
    UnhideComponentDialogComponent,
    HiddenSpecComponent,
    UnhideSpecDialogComponent,
    HiddenEmployeeComponent,
    ConfirmEmployeeResumeDialogComponent,
    ShowPictureDialogComponent,
    UploadPictureDialogComponent,
    AddProductCategoryDialogComponent,
    DeleteWorkConfirmDialogComponent,
    UpdateBatchProcessStatusDialogComponent,
    InstockFormListComponent,
    InstockDetailDialogComponent,
    InstockItemListComponent,
    InstockItemOperationRendererComponent,
    InstockFormOperationRendererComponent,
    HistoricalInstockFormListComponent,
    InstockRecordViewDialogComponent,
    NewInstockEventDialogComponent,
    InstockEventCellRendererComponent,
    InstockFormSingleViewDialogComponent,
    CreateInstockFormComponent,
    DateRangeComponent,
    ConfirmFinishFormDialogComponent,
    HistoricalInstockRecordListComponent,
    ComponentOperationRendererComponent,
    SpecListDialogComponent,
    SpecificationOperationRendererComponent,
    ImageViewRendererComponentComponent,
    UpdatePurchaseInfoComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDividerModule,
    ReactiveFormsModule,
    CustomStyleModule,
    FormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    AgGridModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: UniversalAppInterceptor,
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
