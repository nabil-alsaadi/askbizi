import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export abstract class FormValidators {
  static nonEmptyArray(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value?.length) return null;
      if (control.value?.length === 0)
        return {
          nonEmptyArray: 'You have to pick one option at least'
        };
      return {
        nonEmptyArray: 'Input is not an array'
      };
    };
  }

  static onlyNumbers(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (typeof control.value === 'number') return null;
      return { onlyNumbers: 'Only numbers allowed' };
    };
  }

  static e164PhoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parsedPhoneNumber = parsePhoneNumberFromString(
        control?.value ?? ''
      );
      if (
        parsedPhoneNumber?.number !== control?.value ||
        !parsedPhoneNumber?.isValid()
      )
        return { onlyNumbers: 'Only numbers allowed' };
      return null;
    };
  }
}
