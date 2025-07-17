import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ElectronService } from '../electron/electron.service';
import { Store } from '@ngrx/store';
import { MessageActions } from '../../../store/message';
import {Message, MessageActionType, Sender} from "../../interfaces/message.interface";

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages$: Observable<string | null> = new Observable<string | null>();
  returnCode$: Observable<number | null> = new Observable<number | null>();
  electronService = inject(ElectronService);
  store = inject(Store);
  constructor() {
    this.returnCode$ = this.electronService.code$;
    this.returnCode$.subscribe(code => {
      if (code === 1) {
        console.log('Code 1 received, displaying something...');
      }
    });
    console.log('MessageService initialized');
    this.messages$ = this.electronService.data$;
    this.messages$
      .pipe(
        map(data => {
          if (data !== null) {
            return this.removeUnwantedData(data);
          }
          return data;
        })
      )
      .subscribe(data => {
        if (data) {
          console.log(this.decodeMessage(data));
        } else {
          console.log('Bot not initialized yet.');
        }
      });
  }

  removeUnwantedData(data: string | null): string[] {
    console.log(data);
    if (data == null) {
      return [];
    }
    const currData = data?.split('#@');
    if (currData[0] != 'interface') {
      currData.shift();
    }
    return currData;
  }
  decodeMessage(messageArr: string[]): Message {
    console.log('meesageArr', messageArr);
    const sender: Sender = messageArr[0] as Sender;
    const messageActionType: MessageActionType =
      messageArr[1] as MessageActionType;
    const messageData: string = messageArr[2];
    const message: Message = {
      sender: sender,
      messageActionType: messageActionType,
      messageData: messageData,
      attachments: []
    };
    console.log('Data get from backend:', message);
    if (message.messageActionType === MessageActionType.GET_CURRENT_PATH) {
      this.store.dispatch(
        MessageActions.changeCurrentRootPath({
          currentPath: message.messageData,
        })
      );
    }

    this.store.dispatch(MessageActions.saveMessage({ message }));
    return message;
  }
}
