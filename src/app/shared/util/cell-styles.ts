import {ValueGetterParams} from 'ag-grid-community';
import {statusMap} from './mapping';

export function statusStyle(params) {
  if (params.value === '已完成') {
    return {color: '#1E88E5'}
  } else if (params.value === '进行中') {
    return {color: '#F57C00', fontWeight: 'bold'}
  } else if (params.value === '已取消') {
    return {color: '#9E9E9E', fontStyle: 'italic'}
  } else {
    return {color: '#263238'}
  }
}
