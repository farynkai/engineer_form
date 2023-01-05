import { EngineerInputDto } from './../dto/engineer-input.dto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private http: HttpClient) {}

  createUser(user: EngineerInputDto) {
    return this.http.post(
      'https://engineerapp-1db83-default-rtdb.firebaseio.com/users.json',
      user
    );
  }

  getUsers() {
    return this.http.get(
      'https://engineerapp-1db83-default-rtdb.firebaseio.com/users.json'
    );
  }

  validateEmailNotTaken(control: AbstractControl) {
    return this.isEmailExist(control.value).pipe(
      map((res) => {
        return res ? null : { emailTaken: true };
      })
    );
  }

  isEmailExist(email: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((data) => Object.values(data)),
      map((userList) => userList.filter((user) => user.email === email)),
      map((users) => !users.length)
    );
  }
}
