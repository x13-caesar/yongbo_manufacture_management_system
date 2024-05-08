/** A hero's name can't match the given regular expression */
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Product} from './models/product';

export function existingIdValidator(ids: string[], avoid_dup: boolean = true): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const duplicated = ids.find(id => id === control.value);
    return (duplicated && avoid_dup) ? {existing: {value: control.value}} : null;
  };
}


export function existingProductValidator(products: Product[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const existing = products.find(p => p.id === control.value.id);
    // console.log(control.value);
    // console.log(products);
    // console.log(existing);
    return existing ? null : {"no_product": {value: control.value.id}};
  };
}
