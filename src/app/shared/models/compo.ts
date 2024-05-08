import {Spec} from './spec';
import {ColDef, ValueGetterParams} from 'ag-grid-community';
import {longIntegerFormatter} from '../util/formatter';
import {ComponentOperationRendererComponent} from '../../stock/cell-renderer/component-operation-renderer/component-operation-renderer.component';
import {ImageViewRendererComponentComponent} from '../../stock/cell-renderer/image-view-renderer-component/image-view-renderer-component.component';

export interface Compo {
  id?: string,
  name: string,
  category: string,
  model?: string,
  description?: string,
  expiration?: string,
  unit_weight?: string,
  warn_stock: number,
  picture?: string,
  notice?: string,
  fill_period?: string,
  as_unit?: string,
  specification?: Spec[],
  total_stock?: any,
  hide?: boolean,
}

export interface CompoCategory {
  id?: number,
  category: string,
  prefix: string
}

function totalStockValueGetter(params: ValueGetterParams) {
  return params.data.specification?.filter(spec => spec.hide === false).reduce((prev, curr, idx) => prev + curr.stock, 0);
}

export const compo_col_def: ColDef[] = [
  {field: 'id', headerName: '配件编码', filter: true},
  {field: 'name', headerName: '配件名称', filter: true},
  {field: 'category', headerName: '分类', filter: true},
  {field: 'model', headerName: '型号', filter: true},
  {field: 'description', headerName: '配件描述', minWidth: 300, filter: true},
  {field: 'total_stock', headerName: '当前总库存', filter: 'agNumberFilter', valueGetter: totalStockValueGetter, valueFormatter: longIntegerFormatter},
  {field: 'warn_stock', headerName: '库存警示线', filter: 'agNumberFilter', valueFormatter: longIntegerFormatter},
  {field: 'as_unit', headerName: '单位', filter: true},
  {field: 'unit_weight', headerName: '单位重量', filter: true},
  {field: 'picture', headerName: '图片', filter: true},
  {field: 'fill_period', headerName: '补货周期', filter: true},
  {field: 'expiration', headerName: '保存期限', filter: true},
  {field: 'notice', headerName: '内部备注', filter: true},
  {field: 'hide', headerName: '隐藏/下架', cellDataType: 'boolean', hide: true},
  {field: 'op', headerName: '操作', minWidth: 600, cellRenderer: ComponentOperationRendererComponent},
]
