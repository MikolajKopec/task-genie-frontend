import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {SelectedView} from "./interfaces/list-select-view.interface";
import {AvailableTypes} from "../../interfaces/main-settings";


@Component({
  selector: 'app-list-select-view',
  templateUrl: './list-select-view.component.html',
  styleUrl: './list-select-view.component.scss'
})
export class ListSelectViewComponent {
  @Input()
  addView:boolean = false
  @Input()
  currentContent:TemplateRef<any>|null = null
  @Input()
  views:string[] = []
  @Output()
  selectedView:EventEmitter<SelectedView> = new EventEmitter<SelectedView>()


  selectView(name:string,index:number){
    const view:SelectedView ={
      name:name,
      index:index
    }
    this.selectedView.emit(view)
  }
  addNewView(){
    this.views.push("Nowy " + (this.views.length+1))
  }

  protected readonly AvailableTypes = AvailableTypes;
}
