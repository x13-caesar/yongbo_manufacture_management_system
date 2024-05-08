import {ColDef} from 'ag-grid-community';
import {accountingNumberFormatter, booleanFormatter, dateStringFormatter, statusFormatter} from '../util/formatter';

export interface Vendor {
  id?: number;
  name: string;
  company: string;
  payment_period: string;
  contact: string;
  email: string;
  fax: string;
  address: string;
  notice: string;
}

export const vendor_col_def: ColDef[] = [
  {field: 'id', hide: true },
  {field: 'display_id', headerName: '供应商编号', filter: true },
  {field: 'company', headerName: '公司名', filter: true, editable: true},
  {field: 'name', headerName: '联系人名称', filter: true, editable: true},
  {field: 'contact', headerName: '联系电话', filter: true,  editable: true},
  {field: 'email', headerName: '电子邮箱', filter: true, editable: true},
  {field: 'fax', headerName: '传真', filter: true, editable: true},
  {field: 'address', headerName: '地址', filter: true, editable: true},
  {field: 'payment_period', headerName: '账期', filter: true, editable: true},
  {field: 'notice', headerName: '备注', filter: true, editable: true},
]
