import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private snackBar: MatSnackBar) { }
  successfulRegistration(name: string): void {
    this.snackBar.open(`User ${name} registered successfully`, 'Close', { duration: 3000 });
  }
}
