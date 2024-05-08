import {Buyer} from './buyer';
import {ColDef} from 'ag-grid-community';
import {accountingNumberFormatter, booleanFormatter} from '../util/formatter';

export interface Delivery {
  id?: number,
  product_id: string,
  amount: number,
  order_id?: string,
  buyer_id: number,
  deliver_date: string,
  unit_price: number,
  total_price: number,
  reconciled: boolean,
  paid: boolean,
  notice?: string,
  buyer?: Buyer,
  buyer_company?: string,
  product_name?: string
}


export const delivery_col_def: ColDef[] = [
  {field: 'id', headerName: '交付记录编号', filter: true },
  {field: 'product_id', headerName: '产品编号', filter: true, editable: true},
  {field: 'amount', headerName: '交付数量', filter: true, editable: true},
  {field: 'order_id', headerName: '订单号', filter: true,  editable: true},
  {field: 'buyer_id', headerName: '客户编号', filter: true },
  {field: 'deliver_date', headerName: '交付时间', filter: 'agDateColumnFilter', editable: true, },
  {field: 'unit_price', headerName: '单位价格', filter: true, editable: true, valueFormatter: accountingNumberFormatter},
  {field: 'total_price', headerName: '总价格', filter: true, editable: true, valueFormatter: accountingNumberFormatter},
  {field: 'reconciled', headerName: '已对账', filter: true, editable: true, valueFormatter: booleanFormatter},
  {field: 'paid', headerName: '已付款', filter: true, editable: true, valueFormatter: booleanFormatter},
  {field: 'notice', headerName: '备注', filter: true, editable: true},
]
