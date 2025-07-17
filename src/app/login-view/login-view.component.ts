import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {Store} from "@ngrx/store";
import {UserActions} from "../store/user/user.actions";
import {User} from "../shared/interfaces/user.interface";
@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent {
  private readonly store = inject(Store)
  private readonly router = inject(Router)
  logInUser() {
    const user:User = {
      username:"testowy"
    }
    this.store.dispatch(UserActions.login({user}))
    this.router.navigate(["home"])
  }
}
