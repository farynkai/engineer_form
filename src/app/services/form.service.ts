import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private http: HttpClient) {}
  createUser(user: any) {
    return this.http.post(
      'https://engineerapp-1db83-default-rtdb.firebaseio.com/users.json',
      user
    );
  }
}
