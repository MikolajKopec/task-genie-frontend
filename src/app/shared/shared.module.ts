import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSelectViewComponent } from './components/list-select-view/list-select-view.component';
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";



@NgModule({
  declarations: [
    ListSelectViewComponent
  ],
  exports: [
    ListSelectViewComponent
  ],
  imports: [
    CommonModule,
    MatButton,
    MatIcon,
    MatMiniFabButton
  ]
})
export class SharedModule { }
