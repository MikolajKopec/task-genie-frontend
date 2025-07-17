import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MessageActions } from './message.actions';
import { MessageActionType } from '../../shared/interfaces/message.interface';
import { coreActions } from '../core/core.actions';
import { parseAllSettings, parseJsonToObject } from './utils';
import {RAGSection} from "../../shared/interfaces/rag-tools.interface";

@Injectable()
export class MessageEffects {
  constructor(
    private actions$: Actions,
    private store: Store
  ) {}

  saveMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.saveMessage),
      switchMap(({ message }) => {
        console.log('Data processed by effect:', message);
        if (
          [
            MessageActionType.BOT_RESPONSE,
            MessageActionType.USER_INPUT,
          ].includes(message.messageActionType)
        ) {
          return of(MessageActions.updateResponseMessages({ message }));
        }
        if (message.messageActionType === MessageActionType.BOT_INIT) {
          console.log('Bot init detected', message.messageActionType);
          this.store.dispatch(coreActions.botIsInitialized());
        } else if (message.messageActionType === MessageActionType.SETTINGS) {
          console.log('Bot settings detected', message.messageActionType);
          try {
            const settings = parseAllSettings(message.messageData);
            this.store.dispatch(coreActions.initializeSettings({ settings }));
          } catch (e) {
            console.error(e);
          }
        }else if(message.messageActionType === MessageActionType.RAG_TOOLS){
          console.log("Rag tools init detected", message.messageActionType)
          const ragTools = parseJsonToObject<RAGSection[]>(message.messageData)
          this.store.dispatch(coreActions.setRagTools({ragTools}))
        } else if (
          message.messageActionType === MessageActionType.LISTENING_ENDED
        ) {
          this.store.dispatch(MessageActions.changeIsWaitingForResponse());
          console.log('ENDED LISTENING');
        } else if (message.messageActionType === MessageActionType.TRANSCRIPTION_ENDED) {
          this.store.dispatch(MessageActions.addTranscription({ messageData: message.messageData}));
        }
        return of(MessageActions.updateSystemMessages({ message }));
      }),
      catchError(error => {
        // handle error
        console.error('Error processing message:', error);
        return of({ type: 'ERROR', error });
      })
    )
  );
}
