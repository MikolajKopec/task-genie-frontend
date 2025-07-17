import {ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AvailableTypes, Field, Property, SettingsObject} from "../../shared/interfaces/main-settings";
import {Store} from "@ngrx/store";
import {coreActions} from "../../store/core/core.actions";
import {coreFeature} from "../../store/core/core.reducer";
import {ElectronService, SendMessageActionType} from "../../shared/services/electron/electron.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrl: './settings-form.component.scss'
})
export class SettingsFormComponent implements OnInit {
  @Input() setting: SettingsObject | null = null;

  staticFields: Field[] = [];
  dynamicFields: Field[] = [];

  form: FormGroup = new FormGroup({});
  store = inject(Store)
  alreadyEditedFormValues?:any
  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private electronService: ElectronService,private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.separateFieldsFromSchema();
    this.createFormControls();
    this.store.select(coreFeature.selectSettingsForm).subscribe((settingsForm) => {
      if (settingsForm && settingsForm[this.setting!.schema.title]) {
        this.alreadyEditedFormValues = settingsForm[this.setting!.schema.title]!
        this.form.patchValue(this.alreadyEditedFormValues)
      }
    });
    // this.createFormControls();
    console.log("Static Fields: ", this.staticFields)
    console.log("Dynamic Fields: ", this.dynamicFields)
  }

  private separateFieldsFromSchema() {
    if (this.setting && this.setting.schema) {
      const {properties, $defs} = this.setting.schema;
      const defs = $defs
      Object.entries(properties).forEach(([key, value]) => {
        const propertyType = this.getPropertyType(value, defs);
        if ([AvailableTypes.String, AvailableTypes.Boolean, AvailableTypes.Enum, AvailableTypes.Integer, AvailableTypes.ArrayOfNormalTypes].includes(propertyType)) {
          this.staticFields.push({key, value, defs});
        } else {
          this.dynamicFields.push({key: key, value: value, defs: defs, title: value.title});
        }
      });
    }
  }

  getPropertyType(property: Property, defs: any): AvailableTypes {
    if (property.type === 'array') {
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
    [...this.staticFields].forEach(field => {
      const control = this.createControl(field.value,field.key);
      this.form.addControl(field.key, control);
    });


  }

  getEnumValues(property: Property): string[] | undefined {
    if (property.allOf) {
      const refKey = property.allOf[0].$ref.split('/').pop();
      return this.setting!.schema!.$defs![refKey!]?.enum;
    }
    return undefined;
  }

  private createControl(property: Property,key: string): FormControl {
    const actualValue:string | undefined = this.setting!.values ? this.setting!.values![key] : undefined;
    if (actualValue!==undefined) {
      return new FormControl(actualValue);
    }else{
      return new FormControl(property.default);
    }
  }


  onSubmit() {
    console.log('Form Values:', this.form.value);

    this.store.dispatch(coreActions.setSettingsForm({
      settingsFormKey: this.setting!.schema.title,
      settingsForm: this.form.value
    }));
    const data = {
      settingsFormKey: this.setting!.schema.title,
      settingsForm: this.form.value
    }
    this.electronService.sendDataToBackend(
      JSON.stringify(data),
      SendMessageActionType.SETTINGS_CHANGE
    );
    this._snackBar.open("Settings saved. Please reboot program to load changes.","Dismiss",{panelClass:'info'});
  }

  protected readonly AvailableTypes = AvailableTypes;
}
