import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidationCheck(startKey:string, endKey:string):ValidatorFn{
    return(group:AbstractControl):ValidationErrors | null =>{
        const start = group.get(startKey)?.value;
        const end = group.get(endKey)?.value;
        if(!start || !end){
            return null;
        }
const startDate = new Date(start);
const endDate = new Date(end);
return endDate < startDate ?{dateRangeInvalid:true}:null;
    }

}
