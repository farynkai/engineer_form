import { Component } from '@angular/core';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { takeUntil } from 'rxjs';

import { FormService } from '../../shared/services/form.service';
import { ToastService } from '../../shared/services/toast.service';
import { UnsubscriberComponent } from '../../shared/unsubscriber.component';
import { EngineerInputDto } from '../../shared/dto/engineer-input.dto';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent extends UnsubscriberComponent {
  engineerForm!: FormGroup;
  isChoosen = false;
  frameworkVersion = '';
  frameworks = ['angular', 'react', 'vue'];

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

    this.engineerForm.valueChanges.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      if (this.engineerFormControls['framework'].value) {
        this.isChoosen = true;
        this.frameworkVersion = this.engineerFormControls['framework'].value;
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
      this.toastService.successfulRegistration(engineerInfo.firstName);
      this.formService.createUser(engineerInfo).pipe(
        takeUntil(this.destroyed$)
      ).subscribe();
      this.engineerForm.reset()
    }
  }
}
