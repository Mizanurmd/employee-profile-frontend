import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { catchError, map, of } from "rxjs";
import { AuthServiceService } from "../service/auth-service.service";

export interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
  role?: string;
  statusCode:200;
  
}

export interface AuthenticationResponse {
  token: string;
  role:string;
  refreshToken: string;
}

// ======usernameValidator function here===============
// export function usernameEmailValidator(authServ: AuthServiceService): AsyncValidatorFn {
//   return (control: AbstractControl): any => {
//     return authServ.checkUsernameExists(control.value).pipe(
//       map(isTaken => (isTaken ? { usernameTaken: true } : null)),
//       catchError(() => of(null))
//     );
//   };
// }