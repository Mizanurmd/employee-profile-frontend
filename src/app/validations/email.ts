import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthServiceService } from '../service/auth-service.service';

export function emailExistsValidator(
  authServ: AuthServiceService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Observable<{ emailTaken: boolean } | null> => {
    if (!control.value) {
      return of(null);
    }
    return authServ.checkEmail(control.value).pipe(
      map((isTaken) => (isTaken ? { emailTaken: true } : null)),
      catchError(() => of(null))
    );
  };
}
