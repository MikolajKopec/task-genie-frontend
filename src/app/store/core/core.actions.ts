import {createAction, props} from '@ngrx/store';
import {SettingsObject} from "../../shared/interfaces/main-settings";
import {FormGroup} from "@angular/forms";
import {RAGSection} from "../../shared/interfaces/rag-tools.interface";

export const coreActions = {
  botIsInitialized: createAction('[CoreActions] botIsInitialized'),
  initializeSettings: createAction('[CoreActions] initializeSettings',
    props<{settings:SettingsObject[]}>()),
  setSettingsForm: createAction('[CoreActions] setSettingsForm',props<{settingsFormKey:string,settingsForm:FormGroup}>()),
  setRagTools:createAction('[CoreActions] setRagTools',props<{ragTools:RAGSection[]}>())
};
