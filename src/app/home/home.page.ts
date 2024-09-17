import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage {
  currentStep: number = 0; // Track the current step

  // Steps data (optional, you can use this to display information about each step)
  steps = [
    { title: 'Step 1', description: 'Login' },
    { title: 'Step 2', description: 'Account Details' },
    // { title: 'Step 3', description: 'Confirmation' },
  ];

  constructor() {}
  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  // Go to the previous step
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  // Check if it's the last step
  isLastStep() {
    return this.currentStep === this.steps.length - 1;
  }

  // Check if it's the first step
  isFirstStep() {
    return this.currentStep === 0;
  }
}
