import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { environment } from '../../environments/environment';
import { EngineerInputDto } from '../shared/dto/engineer-input.dto';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  createUser(user: EngineerInputDto): Observable<object> {
    user.dateOfBirth = JSON.stringify(this.datePipe.transform(new Date(user.dateOfBirth), 'dd-MM-yyyy'));
    return this.http.post(environment.url, user);
  }

  getUsers(): Observable<object> {
    return this.http.get(environment.url);
  }

  validateEmailNotTaken(control: AbstractControl): Observable<object | null> {
    return this.isEmailExist(control.value).pipe(
      map((res) => res ? { emailTaken: true } : null)
    );
  }

  validateDate(control: AbstractControl): object | null {
    let currentTime = new Date();
    return control.value < currentTime ? null : { greaterThan: true };
  }

  isEmailExist(email: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((data) => {
        let result = false;
        if(data !== null) { result = !!Object.values(data).filter((user) => user.email === email).length; }
        return result;
      })
    );
  }
}
