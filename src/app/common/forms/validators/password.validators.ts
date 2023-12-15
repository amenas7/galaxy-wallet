import { AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordValidator = (control: AbstractControl): ValidationErrors | null => {

  let value = control?.value || '';

  let isValid;
   if (!isValid) {
    true
   }else{
    //codigo
    //const password = group.get('password')!.value;
    //const confirmPassword = group.get('password_repeat')!.value;

    if (value === value) {
      return null;
    } else {
      return { passwordMismatch: true };
    }

   }


  

    

}