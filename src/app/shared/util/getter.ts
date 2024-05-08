import {ValueGetterParams} from 'ag-grid-community';
import {statusMap} from './mapping';

export function formStatusGetter(params: ValueGetterParams) {
  const statusValue = params.data.form_status;
  return statusMap[statusValue]
}


export function paidStatusGetter(params: ValueGetterParams){
  return params.getValue("paid") ? '是' : '否';
}
