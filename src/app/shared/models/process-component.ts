import {Compo} from './compo';

export interface ProcessComponent {
  id?: number,
  process_id?: string,
  component_id: string,
  component_name?: string,
  attrition_rate: number,
  consumption: number,
  component?: Compo
}
