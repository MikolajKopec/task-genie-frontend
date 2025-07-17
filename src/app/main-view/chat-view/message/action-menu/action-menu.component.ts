import { Component, inject, Input } from '@angular/core';
import {
  ElectronService,
  SendMessageActionType,
} from '../../../../shared/services/electron/electron.service';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss'
})
export class ActionMenuComponent {
  electronService = inject(ElectronService);
  @Input() messageText: string = '';

  copyTextToClipboard() {
    navigator.clipboard.writeText(this.messageText);
  }

  listenToMessage() {
    console.log(`Listening to message: ${this.messageText}`);
    this.electronService.sendDataToBackend(
      this.messageText,
      SendMessageActionType.MESSAGE_TO_READ,
    );
  }
}
