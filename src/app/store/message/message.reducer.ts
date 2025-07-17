import {createFeature, createReducer, createSelector, on} from '@ngrx/store';
import {MessageActions} from './message.actions';
import {Message, MessageActionType, Sender,} from '../../shared/interfaces/message.interface';

export interface messageReducer {
  isWaitingForResponse: boolean;
  isWaitingForInput: boolean;
  responseMessages: Message[];
  systemMessages: Message[];
  currentRootPath: string;
  transcription: string;

}

export const initialState: messageReducer = {
  isWaitingForResponse: false,
  isWaitingForInput: false,
  responseMessages: [],
  systemMessages: [],
  currentRootPath: 'C:/praca',
  transcription: ''
};

export const messageFeature = createFeature({
  name: 'message',
  reducer: createReducer(
    initialState,
    on(MessageActions.updateResponseMessages, (state, {message}) => {
      const newMessages = [...state.responseMessages, message];
      return {
        ...state,
        responseMessages: newMessages,
        isWaitingForInput: false,
        isWaitingForResponse: false,
      };
    }),
    on(MessageActions.updateSystemMessages, (state, {message}) => {
      const newMessages = [...state.systemMessages, message];
      return {
        ...state,
        systemMessages: newMessages,
      };
    }),
    on(MessageActions.changeIsWaitingForResponse, state => {
      console.log(
        'ChangeIsWaitingForResponse is changed for:',
        !state.isWaitingForResponse
      );
      return {...state, isWaitingForResponse: !state.isWaitingForResponse};
    }),
    on(MessageActions.changeIsWaitingForInput, state => {
      console.log(
        'changeIsWaitingForInput is changed for:',
        !state.isWaitingForInput
      );
      return {...state, isWaitingForInput: !state.isWaitingForInput};
    }),
    on(MessageActions.changeCurrentRootPath, (state, {currentPath}) => {
      console.log('CurrentRootPath changed by reducer:', currentPath);
      return {...state, currentRootPath: currentPath};
    }),
    on(MessageActions.addTranscription, (state, {messageData}) => {
      console.log('Transcription in reducer:', messageData);
      return {...state, transcription: messageData};
    })
  ),
});
