import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';

import {Store} from "@ngrx/store";
import {coreFeature} from "../store/core/core.reducer";
import {SettingsObject} from "../shared/interfaces/main-settings";
import {SelectedView} from "../shared/components/list-select-view/interfaces/list-select-view.interface";

@Component({
  selector: 'app-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrl: './settings-view.component.scss'
})
export class SettingsViewComponent implements OnInit{
  store = inject(Store)
  availableSettings: SettingsObject[]  = []
  currentSetting:SettingsObject | null = null;
  views:string[] = []

  constructor(private cdr:ChangeDetectorRef) {
  }
  ngOnInit() {
    this.store.select(coreFeature.selectSettings).pipe().subscribe((settings: SettingsObject[]) => {
      settings?.forEach(setting => {
        this.availableSettings.push(setting)
        this.views.push(setting.schema.title)
      })
    })
  }

  changeCurrentSetting(currentView:SelectedView) {
    this.currentSetting = null;
    this.cdr.detectChanges()
    this.currentSetting = this.availableSettings[currentView.index];
    this.cdr.detectChanges()
    console.log(this.currentSetting)
  }
}
