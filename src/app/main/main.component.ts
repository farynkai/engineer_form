import { Component } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { ToastService } from '../shared/services/toast.service';
import { FormService } from './main.service';
import { UnsubscriberComponent } from '../shared/unsubscriber.component';
import { EngineerInputDto } from '../shared/dto/engineer-input.dto';
@Component({
  selector: 'app-form',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent extends UnsubscriberComponent {
  engineerForm!: FormGroup;
  isChoosen = false;
  frameworkVersion = '';
  frameworksVersion: { [key: string]: string[] } = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3']
  };
  frameworks = Object.keys(this.frameworksVersion);
  get engineerFormControls(): { [key: string]: AbstractControl } {
    return this.engineerForm.controls;
  }

  constructor(private fb: FormBuilder, private formService: FormService, private toastService: ToastService) {
    super();
    this.initFilterForm();
  }

  private initFilterForm(): void {
    this.engineerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.formService.validateDate]],
      framework: ['', Validators.required],
      frameworkVersion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], this.formService.validateEmailNotTaken.bind(this.formService)],
      hobbies: this.fb.array([this.newHobbieGroup()]),
    });

    this.engineerFormControls['framework'].valueChanges.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      if (this.engineerFormControls['framework'].value) {
        this.isChoosen = true;
        this.frameworkVersion = this.engineerFormControls['framework'].value;
        this.engineerFormControls['frameworkVersion'].setValue(this.frameworksVersion[this.frameworkVersion][0])
      }
    });
  }

  hobbies(): FormArray<FormGroup> {
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
      this.formService.createUser(engineerInfo).pipe(
        takeUntil(this.destroyed$)
      ).subscribe();
      this.toastService.successfulRegistration(engineerInfo.firstName);
      this.engineerForm.reset();
      this.setNullToErrors();
    }
  }

  setNullToErrors(): void {
    Object.values(this.engineerFormControls).forEach(value => {
      value.setErrors(null);
    });
    Object.values(this.hobbies().controls).forEach(formgroup => {
      Object.values((formgroup.controls)).forEach(control => {
        control.setErrors(null);
      });
    })
  }
}
