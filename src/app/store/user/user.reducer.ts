import {User} from "../../shared/interfaces/user.interface";
import {createFeature, createReducer, on} from "@ngrx/store";
import {UserActions} from "./user.actions";

export interface UserReducer{
  isLogged:boolean,
  currentUser:User
}
export const initialState:UserReducer = {
  isLogged:false,
  currentUser:{
    username:"Test"
  }
}

export const userFeature = createFeature({
  name:"User",
  reducer:createReducer(
    initialState,
    on(UserActions.login,(state,{user})=> {
      return {...state,currentUser:user,isLogged:true}
    })
  )
})
