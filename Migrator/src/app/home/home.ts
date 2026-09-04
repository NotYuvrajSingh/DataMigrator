import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  // locations = [1];
  //What does the above line mean?
  // It means that locations is an array that contains a single number, 1. 
  // This could be used to track the number of locations or steps in a process.
  migrationForm !: FormGroup;

  migrationComponents = [
    'Login XREF',
    'Location',
    'Group',
    'Category',
    'Group Location',
    'Batch',
    'FOODITEMLIST',
    'Generated Report',
    'Settings_XREF',
    'Shift Schedule',
    'LABELTEMPLATE',
    'Account_Image',
    'LocationPrinterDeviceSummary'
  ];

  // How to make this array a part of the form, so that it can be sent in the post request?
  // You can create a FormArray for the migrationComponents and populate it with form controls.

  // what is !:
  // It means that the assignment is non null, it is however right now not anything, but later will be FormGroup

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  // I think a good way to think about constructors in angular in terms of React can be like:
  // const http = HttpClient();
  // const fb = FormBuilder();

  atLeastOneSelectedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as FormArray;
      const checked = formArray.controls.some(c => c.value);
      return checked ? null : { required: true };
    };
  }

  // What is AbstractControl?
  // AbstractControl is the base class for FormControl, FormGroup, and FormArray. 
  // It provides shared behavior and properties for all form controls.

  // What is ValidationErrors?
  // ValidationErrors is an interface that represents the errors returned by a validator. 
  // It is a key-value pair where the key is the error name and the value is any additional information about the error.

  // What is ValidatorFn?
  // ValidatorFn is a function that takes an AbstractControl and returns either a ValidationErrors object or null.

  // What is the .some() method?
  // The .some() method tests whether at least one element in the array passes the test implemented by the provided function.

  locationValidator(): ValidatorFn {
    return (control : AbstractControl) => {
      const formArray = control as FormArray;

      //What is as in JS?
      // The as keyword is used for type assertion in TypeScript. It tells the compiler to treat a value as a specific type.

      // What is FormArray?
      // FormArray is a way to manage an array of form controls in Angular. It allows you to dynamically add or remove controls.

      const allLocationsSelected = this.migrationForm?.get('allLocationsSelected')?.value;

      if(allLocationsSelected) {
        return null;
      }

      if(formArray.controls.some(c => c.value?.trim()))
        return null;
      else
        return {locationRequired: true};

      // What does some(c => c.value?.trim()) mean?
      // It checks if at least one control in the FormArray has a non-empty value after trimming whitespace.

      // Whare is locationRequired coming from?
      // locationRequired is a custom validation error that we are returning if no locations are selected.
    }
  }


  ngOnInit() {
    this.migrationForm = this.fb.group({
      pbiNumber: ['', [Validators.required]],
      sourceAccount: ['', Validators.required],
      destinationAccount: ['', Validators.required],
      allLocationsSelected: [false],
      locations: this.fb.array(
        [this.fb.control('')],
        [this.locationValidator()]
      ),

      // Why are the fb.control, and this.locationValidator() in two different arrays?
      // The first array is for the initial form controls, and the second array is for the validators.
      migrationComponents: this.fb.array(
        this.migrationComponents.map(() =>
          this.fb.control(false)),
        [this.atLeastOneSelectedValidator()]
      ),
    });

    this.migrationForm.get('allLocationsSelected')?.valueChanges.subscribe(() => {
      this.locations.updateValueAndValidity();
    });
  }

  // Why use ngOnInit()
  // Angular calls ngOnInit() shortly after creating a component.
  // It's a good place to put initialization logic for the component, such as fetching data or setting up the form.


  // This is a getter function which we have because we don't want to write this.migrationForm.get('locations')
  get locations() {
    return this.migrationForm.get('locations') as FormArray;

    //What is FormArray?
    // FormArray is a way to manage an array of form controls in Angular.
  }

  get migrationComponentControls() {
    return this.migrationForm.get('migrationComponents') as FormArray;
  }

  addLocation() {
    // this.locations.push(this.locations.length + 1);
    // Numbers are being added to the array, this array does not store the acutal locations, but just stores the numbers so as to 
    // keep track of how many locations are there. The actual location data is being stored in the formControls.
    // How do I access it? Suppose, I have to send the data in a post request, how do I access the data in the formControls?
    // You can access the data in the form controls using the value property of the FormGroup. 
    // For example, to get the value of the pbiNumber control, you can use this.migrationForm.get('pbiNumber').value. 

    this.locations.push(
      this.fb.control('')
    );
  }

  removeLocation() {
    this.locations.removeAt(this.locations.length - 1);
  }

  sendRequest() {
    if (this.migrationForm.invalid) {
      this.migrationForm.markAllAsTouched();
      return;
      // What does this mean? What does Touched mean?
      // Touched means that the user has interacted with the form control, even if it's invalid.
    }

    this.http.post(
      'http://localhost:3000/api/location',
      this.migrationForm.value
    ).subscribe(
      response => {
        console.log('Request successful:', response);
      }
    )
  }
}