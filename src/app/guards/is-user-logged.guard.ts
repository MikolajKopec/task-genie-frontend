import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {userFeature} from "../store/user/user.reducer";
import {map} from "rxjs";

export const isUserLoggedGuard: CanActivateFn = (route, state) => {
  const store = inject(Store)
  const router = inject(Router)
  return store.select(userFeature.selectIsLogged).pipe(map((isLogged)=>{
    if (!isLogged){

      console.log("User is not logged in.")
      router.navigate([""])
    }
    return true
  }))
};
