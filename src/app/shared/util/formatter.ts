import {ValueFormatterParams} from 'ag-grid-community';
import {statusMap} from './mapping';

export function accountingNumberFormatter(params: ValueFormatterParams) {
  if (!params.value) {
    return '无数据'
  } else {
    return Number(params.value).toLocaleString('zh-CN', {
      // style: 'currency',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

export function longIntegerFormatter(params: ValueFormatterParams) {
  if (!params.value) {
    return '无数据'
  } else {
    return Number(params.value).toLocaleString('zh-CN', {
      // style: 'currency',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}

export function dateStringFormatter(params: ValueFormatterParams) {
  if (!params.value) {
    return '无数据'
  }
  return new Date(params.value).toLocaleDateString('zh-CN', {
    timeZone: 'Asia/Shanghai'
  });
}

export function datetimeStringFormatter(params: ValueFormatterParams) {
  if (!params.value) {
    return '无数据'
  }
  return new Date(params.value).toLocaleString('zh-CN', {
    timeZone: 'Asia/Shanghai'
  })
}

export function statusFormatter(params: ValueFormatterParams) {
  return statusMap[params.value]
}


export function booleanFormatter(params: ValueFormatterParams){
  return params.value ? '是' : '否';
}

export function vendorIdFormatter(params: ValueFormatterParams) {
  // padding params.value with 0 to make it 3 digits long
  return params.value.toString.padStart(3, "0")
}
