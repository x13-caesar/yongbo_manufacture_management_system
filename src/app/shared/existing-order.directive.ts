/** A hero's name can't match the given regular expression */
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function existingOrderValidator(orders: number[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const duplicated = orders.find(order => order === control.value);
    return duplicated ? {existing: {value: control.value}} : null;
  };
}
