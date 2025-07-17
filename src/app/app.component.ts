import {Component, inject, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of, Subject} from "rxjs";
import {coreFeature} from "./store/core/core.reducer";
import {Store} from "@ngrx/store";
import {MessageService} from "./shared/services/message/message.service";
import {ElectronService} from "./shared/services/electron/electron.service";
import {userFeature} from "./store/user/user.reducer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  title = 'task-genie';
  store = inject(Store)
  private readonly messageService = inject(MessageService)
  private readonly electronService = inject(ElectronService)
  $isInitialized:Observable<boolean> = this.store
    .select(coreFeature.selectIsInitialized)
  $isUserLoggedIn:Observable<boolean> = this.store.select(userFeature.selectIsLogged)
}
