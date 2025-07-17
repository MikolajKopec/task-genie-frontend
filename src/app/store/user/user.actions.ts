import {createAction, props} from "@ngrx/store";
import {Message} from "../../shared/interfaces/message.interface";
import {User} from "../../shared/interfaces/user.interface";

export const UserActions = {
  login: createAction(
    '[UserActions] login',
    props<{ user: User }>()
  ),
}
