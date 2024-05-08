export interface WarehouseRecord {
  id?: number,
  batch_process_id: number,
  component_id: string,
  specification_id: string,
  component_name: string,
  consumption: number,
  specification_net_price?: number,
  specification_gross_price?: number
}
