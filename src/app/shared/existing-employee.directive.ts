import { Directive } from '@angular/core';
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Employee} from './models/employee';

@Directive({
  selector: '[appExistingEmployee]'
})
export class ExistingEmployeeDirective {

  constructor() { }

}

export function existingEmployeeIdValidator(employee_ids: number[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const duplicated = employee_ids.find(eid => eid === control.value);
    return duplicated ? {existing: {value: control.value}} : null;
  };
}
