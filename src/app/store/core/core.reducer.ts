import {createFeature, createReducer, on} from '@ngrx/store';
import {coreActions} from './core.actions';
import {AvailableTypes, SettingsObject} from "../../shared/interfaces/main-settings";
import {FormGroup} from "@angular/forms";
import {RAGSection} from "../../shared/interfaces/rag-tools.interface";

export interface coreReducer {
  isInitialized: boolean;
  settings: SettingsObject[];
  settingsForm: {[key:string]: FormGroup | undefined} | undefined;
  ragTools:RAGSection[]
}

export const initialState: coreReducer = {
  isInitialized: true,
  settings: [],
  settingsForm: undefined,
  ragTools:[]

};

export const coreFeature = createFeature({
  name: 'core',
  reducer: createReducer(
    initialState,
    on(coreActions.botIsInitialized, state => {
      console.log('isInitialized is changed by reducer');
      return {...state, isInitialized: true};
    }),
    on(coreActions.initializeSettings, (state, {settings}) => {
      console.log('initializeSettings is changed by reducer');
      console.log(settings)
      return {...state, settings: settings};
    }),
    on(coreActions.setSettingsForm, (state, {settingsFormKey,settingsForm}) => {
        const newSettingsForm = {...state.settingsForm, [settingsFormKey]: settingsForm};
        console.log('setSettingsForm is changed by reducer');
        return {...state, settingsForm: newSettingsForm};
      }),
    on(coreActions.setRagTools,(state,{ragTools}) => {
      console.log('rag tools is changed by reducer');
      const newRagTools = ragTools
      console.log(newRagTools)
      return {...state,ragTools:newRagTools}
    } )
  ),

});
