import { createAction, props } from '@ngrx/store';
import {Message, MessageActionType, Sender,} from '../../shared/interfaces/message.interface';

// Messages

export const MessageActions = {
  saveMessage: createAction(
    '[MessageActions] saveMessage',
    props<{ message: Message }>()
  ),
  updateSystemMessages: createAction(
    '[MessageActions] updateSystemMessages',
    props<{ message: Message }>()
  ),
  updateResponseMessages: createAction(
    '[MessageActions] updateResponseMessages',
    props<{ message: Message }>()
  ),
  changeIsWaitingForResponse: createAction(
    '[MessageActions] changeIsWaitingForResponse'
  ),
  changeIsWaitingForInput: createAction(
    '[MessageActions] changeIsWaitingForInput'
  ),
  changeCurrentRootPath: createAction(
    '[MessageActions] changeCurrentRootPath',
    props<{ currentPath: string }>()
  ),
  addTranscription: createAction(
    '[MessageActions] addTranscription',
    props<{ messageData: string }>()
  ),
};
