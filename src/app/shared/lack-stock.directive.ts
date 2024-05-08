/** A hero's name can't match the given regular expression */
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function lackStockValidation(consumption: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const lack = control.value.stock < consumption;
    return lack ? {lack_stock: {value: control.value}} : null;
  };
}
