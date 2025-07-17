import { Component, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-loading-view',
  templateUrl: './loading-view.component.html',
  styleUrl: './loading-view.component.scss',
  animations: [
    trigger('fadeOutAnimation', [
      transition(':leave', [  // :leave is alias for '* => void'
        animate('1s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoadingViewComponent implements OnDestroy {
  ngOnDestroy() {

  }
}
