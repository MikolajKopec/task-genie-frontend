import {ChangeDetectorRef, Component, inject, Input} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

import {AvailableTypes, Field, Property} from "../../../shared/interfaces/main-settings";
import {MatChipInputEvent} from "@angular/material/chips";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-settings-form-recursive',
  templateUrl: './settings-form-recursive.component.html',
  styleUrl: './settings-form-recursive.component.scss'
})
export class SettingsFormRecursiveComponent {
  @Input() Field: Field | undefined;
  @Input() values: { [key: string]: any } | undefined;
  @Input() parentForm: FormGroup | undefined;
  @Input() parentControls: AbstractControl | undefined;
  @Input() parentDefs: { [key: string]: any } | undefined;
  @Input() fieldValues: any;

  @Input() alreadyEditedFormValues:any;
  @Input() schemaTitle:any;

  store = inject(Store)
  panelOpenState = false;
  form: FormGroup = new FormGroup({});

  properties: { [key: string]: Property } | undefined;

  arrayKeywords: { [key: string]: string[] } = {}

  staticFields: Field[] = [];
  dynamicFields: Field[] = [];

  announcer = inject(LiveAnnouncer);

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder) {
  }

  ngOnInit() {
    const ref = this.Field?.value.allOf ? this.Field?.value.allOf[0].$ref.split('/').pop() : this.Field?.value!.items!.$ref!.split('/').pop();
    if (this.Field!.defs![ref!].properties == undefined) {
      this.properties = this.parentDefs!['properties']
    } else {
      this.properties = this.Field!.defs![ref!].properties!
    }

    this.separateFieldsFromSchema();
    this.createFormControls();
    console.log("Static Fields: ", this.staticFields)
    console.log("Dynamic Fields: ", this.dynamicFields)
    this.parentForm?.addControl(this.Field?.key!, this.form!);
  }

  private separateFieldsFromSchema() {
    const properties = this.properties;
    const defs = this.Field!.defs!
    Object.entries(properties!).forEach(([key, value]) => {
      const propertyType = this.getPropertyType(value, defs);
      if ([AvailableTypes.String, AvailableTypes.Boolean, AvailableTypes.Enum, AvailableTypes.Integer, AvailableTypes.ArrayOfNormalTypes].includes(propertyType)) {
        this.staticFields.push({key, value, defs});

      } else {
        this.dynamicFields.push({key: key, value: value, defs: defs, title: value.title});
      }
    });
  }

  getPropertyType(property: Property, defs: any): AvailableTypes {
    if (property.type === "array") {
      if (property.items?.type === 'string' || property.items?.type === 'integer' || property.items?.type === 'boolean') {
        return AvailableTypes.ArrayOfNormalTypes;
      }
    }
    if (property.type) {
      return property.type as AvailableTypes;
    } else if (property.allOf && property.allOf[0].$ref) {
      const defKey = property.allOf[0].$ref.split('/').pop();
      const definition = defs[defKey!];
      if (definition.enum) {
        return AvailableTypes.Enum;
      }
    }
    return AvailableTypes.Object;
  }

  private createFormControls() {
    let arrayField: FormArray<any> = this.fb.array([]);

    console.log("FIELD VALUES", this.fieldValues)
    console.log("############################")
    console.log(this.Field?.key)
    console.log(this.form.value,this.alreadyEditedFormValues)
    console.log("############################")
    if (this.alreadyEditedFormValues){
      this.fieldValues = this.alreadyEditedFormValues
    }
    if (!(this.fieldValues instanceof Array)) {
      const fg = this.fb.group({})


      this.staticFields.forEach(field => {

        if (field.value.type === 'array') {
          console.log("-----------------")
          console.log(field.value.default)
          console.log(field.default)
          console.log("-----------------")
          this.arrayKeywords[field.key] = field.value.default || field.default || [];
        }
        const control = this.createControlNormal(field.value, field.key);
        fg.addControl(field.key, control)
      });
      arrayField.push(fg);
    }else{

      console.log("@@@@@@@@@@@@@@@")
      this.fieldValues?.forEach((fieldValue)=>{
        const fg = this.fb.group({})
        console.log("FieldValue",fieldValue)
        this.staticFields.forEach(field => {
          if (field.value.type === 'array') {
            this.arrayKeywords[field.key] = field.value.default || field.default || [];
          }

          const control = this.createControl(fieldValue, field.key,field.value.default || "");
          fg.addControl(field.key, control)
        });
        arrayField.push(fg);

      })
      console.log(arrayField.value)
      console.log("@@@@@@@@@@@@@@@")
    }

    this.form?.addControl(this.Field?.key!, arrayField);
  }
  onInputChange(event: Event, key: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Convert comma-separated string to array
    const arrayValues = value.split(',').map(item => item.trim()).filter(item => item);

    // Update arrayKeywords and form control value
    this.arrayKeywords[key] = arrayValues;
    this.form.get(key)?.setValue(arrayValues);
  }


  addToFormArray() {
    const fg = this.fb.group({})


    this.staticFields.forEach(field => {

      if (field.value.type === 'array') {
        this.arrayKeywords[field.key] = field.value.default || [];
      }
      const control = this.createControl(field.value, field.key,field.value.default || "");
      fg.addControl(field.key, control)


      if (this.getPropertyType(field.value, this.Field?.defs!) == AvailableTypes.ArrayOfNormalTypes) {
        control.setValue("");
      }
    });
    const formArray = this.form?.get(this.Field?.key!) as FormArray;
    formArray.push(fg);
  }

  removeFromFormArray(index: number) {
    const formArray = this.form?.get(this.Field?.key!) as FormArray;

    formArray.removeAt(index);
  }

  getFormArray() {
    return this.form?.get(this.Field?.key!) as FormArray;
  }

  getEnumValues(property: Property): string[] | undefined {
    if (property.allOf) {
      const refKey = property.allOf[0].$ref.split('/').pop();
      return this.Field!.defs![refKey!]?.enum;
    }
    return undefined;
  }

  removeKeyword(keyword: string, key: string) {
    const index = this.arrayKeywords[key].indexOf(keyword);
    if (index >= 0) {
      this.arrayKeywords[key] = [
        ...this.arrayKeywords[key].slice(0, index),
        ...this.arrayKeywords[key].slice(index + 1),
      ];
      console.log(this.arrayKeywords[key]);
      this.announcer.announce(`removed ${keyword}`);
    } else {
      console.log(`Keyword not found: ${keyword}`);
    }
  }


  add(event: MatChipInputEvent, key: string): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.arrayKeywords[key].push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  private createControl(property: any, key: string, defaultVal:string): FormControl {
    const actualValue: string | undefined = property[key] ?? undefined;
    console.log("Actual Value: ", actualValue)
    if (actualValue !== undefined) {
      return new FormControl( actualValue);
    } else {
      return new FormControl(defaultVal);
    }

  }
  private createControlNormal(property: Property, key: string): FormControl {
    const actualValue: string | undefined = this.values ? this.values[key] : undefined;
    if (actualValue !== undefined) {
      return new FormControl(actualValue);
    } else {
      return new FormControl(property.default);
    }

  }


  protected readonly AvailableTypes = AvailableTypes;
}
