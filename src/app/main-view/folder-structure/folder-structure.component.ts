import { Component, inject, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
  ElectronService,
  SendMessageActionType,
} from '../../shared/services/electron/electron.service';
import { Store } from '@ngrx/store';
import {Observable} from "rxjs";
import {messageFeature} from "../../store/message";

@Component({
  selector: 'app-folder-structure',
  templateUrl: './folder-structure.component.html',
  styleUrl: './folder-structure.component.scss'
})
export class FolderStructureComponent {
  store = inject(Store);
  electron = inject(ElectronService);
  $currentPath:Observable<string> = this.store
    .select(messageFeature.selectCurrentRootPath)

  selectCurrentPath() {
    this.electron.selectDirectory().subscribe(currentPath => {
      this.electron.sendDataToBackend(
        currentPath[0],
        SendMessageActionType.SET_CURRENT_PATH
      );
    });
  }
}
