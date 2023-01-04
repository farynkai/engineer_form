import { Component } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { takeUntil } from 'rxjs';
import { DatePipe } from '@angular/common';

import { UnsubscriberComponent } from '../unsubscriber/unsubscriber.component';
import { EngineerInputDto } from './../../dto/engineer-input.dto';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent extends UnsubscriberComponent {
  engineerForm!: FormGroup;
  isChoosen = false;
  frameworkVersion = '';

  get engineerFormControls(): { [key: string]: AbstractControl } {
    return this.engineerForm.controls;
  }

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    super();
    this.initFilterForm();
  }

  private initFilterForm(): void {
    this.engineerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      framework: ['', Validators.required],
      frameworkVersion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      hobbieName: ['', Validators.required],
      hobbieDuration: ['', Validators.required],
    });

    this.engineerForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        if (this.engineerFormControls['framework'].value === 'vue') {
          this.isChoosen = true;
          this.frameworkVersion = 'vue';
        }
        if (this.engineerFormControls['framework'].value === 'react') {
          this.isChoosen = true;
          this.frameworkVersion = 'react';
        }
        if (this.engineerFormControls['framework'].value === 'angular') {
          this.isChoosen = true;
          this.frameworkVersion = 'angular';
        }
      });
  }

  engineerFormToRequest(): EngineerInputDto {
    return {
      firstName: this.engineerFormControls['firstName'].value,
      lastName: this.engineerFormControls['lastName'].value,
      dateOfBirth: this.datePipe.transform(
        new Date(this.engineerFormControls['dateOfBirth'].value),
        'yyyy-MM-dd'
      ),
      framework: this.engineerFormControls['framework'].value,
      frameworkVersion: this.engineerFormControls['frameworkVersion'].value,
      email: this.engineerFormControls['email'].value,
      hobbies: [
        {
          name: this.engineerFormControls['hobbieName'].value,
          duration: this.engineerFormControls['hobbieDuration'].value,
        },
      ],
    };
  }

  onSubmit() {
    console.log(this.engineerFormToRequest());
  }
}
