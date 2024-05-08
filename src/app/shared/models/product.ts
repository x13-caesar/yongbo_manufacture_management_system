import {Process} from './process';

export interface Product {
  id?: string,
  name: string,
  category: string,
  description?: string,
  last_produce?: string,
  inventory: number,
  picture?: string,
  custom?: string,
  notice?: string,
  deprecated?: boolean,
  deprecated_date?: Date,
  process?: Process[]
}
