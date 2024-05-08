import {Vendor} from './vendor';
import {ColDef} from 'ag-grid-community';
import {accountingNumberFormatter, longIntegerFormatter} from '../util/formatter';
import {SpecificationOperationRendererComponent} from '../../stock/cell-renderer/specification-operation-renderer/specification-operation-renderer.component';
import {ImageViewRendererComponentComponent} from '../../stock/cell-renderer/image-view-renderer-component/image-view-renderer-component.component';

export interface Spec {
  id?: string,
  component_id: string,
  vendor_id: string,
  vendor?: Vendor,
  vendor_company?: string,
  gross_price?: number,
  net_price?: number,
  use_net: boolean,
  stock: number,
  unit_amount?: number,
  blueprint?: string,
  notice?: string
  component_name?: string,
  hide?: boolean,
}

export const spec_col_def: ColDef[] = [
  {field: 'id', headerName: '配件规格编码', cellDataType: 'text', editable: true},
  {field: 'vendor_id', hide: true},
  {field: 'display_vendor_id', headerName: '供应商编号', cellDataType: 'text'},
  {field: 'vendor.company', headerName: '供应商公司', cellDataType: 'text'},
  {field: 'op', headerName: '操作', minWidth: 400, cellRenderer: SpecificationOperationRendererComponent},
  {field: 'gross_price', headerName: '含税价', cellDataType: 'number', editable: true, valueFormatter: accountingNumberFormatter},
  {field: 'net_price', headerName: '税前价', cellDataType: 'number', editable: true, valueFormatter: accountingNumberFormatter},
  {field: 'use_net', headerName: '采购使用税前价格', editable: true, cellDataType: 'boolean'},
  {field: 'stock', headerName: '目前库存', cellDataType: 'number', editable: true, valueFormatter: longIntegerFormatter},
  {field: 'unit_amount', headerName: '包装数量', editable: true, cellDataType: 'number',},
  {field: 'notice', headerName: '采购备注', editable: true, cellDataType: 'text'},
  {field: 'hide', headerName: '隐藏/下架', cellDataType: 'boolean', hide: true},
]

