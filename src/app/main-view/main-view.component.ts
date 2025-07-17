import {Component, OnInit} from '@angular/core';
import {coreFeature} from "../store/core/core.reducer";
import {selectIsWaitingForResponse} from "../store/message/message.selectors";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Observable, of, Subscription} from "rxjs";
import {
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { MessageService } from '../shared/services/message/message.service';
import { Store } from '@ngrx/store';
import { messageFeature } from '../store/message';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrl: './main-view.component.scss'
})
export class MainViewComponent implements OnInit{
  messageService = inject(MessageService);
  store = inject(Store)

  $isWaitingForResponse:Observable<boolean> = this.store
    .select(selectIsWaitingForResponse)
  $isWaitingForInput:Observable<boolean> = this.store
    .select(messageFeature.selectIsWaitingForInput)
  isFailed:boolean = false;
  isFailedSub:Subscription = new Subscription();
  constructor(private cdr: ChangeDetectorRef,private _snackBar: MatSnackBar) {}
  ngOnInit() {

    this.isFailedSub = this.messageService.returnCode$.subscribe(code => {
      if (code === 1) {
        console.log('Code 1 received, displaying message...');
        this.isFailed = true;
        this._snackBar.open("Error: Failed to run backend. Code: " + code,"Dismiss",{horizontalPosition: 'center', verticalPosition: 'top'});
      }
    })
  }

  ngOnDestroy() {
    this.isFailedSub.unsubscribe();
  }
}
