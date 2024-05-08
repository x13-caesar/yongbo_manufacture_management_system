import {DataSource} from '@angular/cdk/collections';
import {Product} from './product';
import {ProductService} from '../http-services/product.service';
import {Observable} from 'rxjs';

export class APIDataSource extends DataSource<Product> {

  constructor(
    private productService: ProductService
  ) {
    super();
  }

  connect(): Observable<Product[]> {
    return this.productService.getProducts();
  }

  disconnect() {}
}
