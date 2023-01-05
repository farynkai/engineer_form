import { Component } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { takeUntil } from 'rxjs';

import { UnsubscriberComponent } from '../unsubscriber/unsubscriber.component';
import { EngineerInputDto } from './../../dto/engineer-input.dto';
import { FormService } from './../../services/form.service';

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

  constructor(private fb: FormBuilder, private formService: FormService) {
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
      email: [
        '',
        [Validators.required, Validators.email],
        this.formService.validateEmailNotTaken.bind(this.formService),
      ],
      hobbies: this.fb.array([this.newHobbieGroup()]),
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

  hobbies(): FormArray {
    return this.engineerForm.get('hobbies') as FormArray;
  }

  newHobbieGroup(): FormGroup {
    return this.fb.group({
      hobbieName: ['', Validators.required],
      hobbieDuration: ['', Validators.required],
    });
  }

  addHobbie(): void {
    this.hobbies().push(this.newHobbieGroup());
  }

  removeHobbie(i: number): void {
    this.hobbies().removeAt(i);
  }

  createEngineer(engineerInfo: EngineerInputDto): void {
    if (this.engineerForm.valid) {
      this.formService
        .createUser(engineerInfo)
        .pipe(takeUntil(this.destroyed$))
        .subscribe();
    }
  }
}
