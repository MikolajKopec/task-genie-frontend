import { createFeatureSelector, createSelector } from '@ngrx/store';
import { messageReducer } from './message.reducer';
const getMessageFeatureState = createFeatureSelector<messageReducer>('message');
export const selectResponseMessages = createSelector(
  getMessageFeatureState,
  state => state.responseMessages
);

export const selectIsWaitingForResponse = createSelector(
  getMessageFeatureState,
  state => state.isWaitingForResponse
);
