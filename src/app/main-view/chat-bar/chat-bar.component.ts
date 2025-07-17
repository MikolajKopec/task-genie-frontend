import {Component, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {inject} from '@angular/core';
import {ElectronService, SendMessageActionType} from '../../shared/services/electron/electron.service';
import {Message, MessageActionType, Sender, FileAttachment} from '../../shared/interfaces/message.interface';
import {MessageActions, messageFeature} from '../../store/message';
import {select, Store} from '@ngrx/store';
import {distinctUntilChanged, Observable, of, shareReplay, Subscription, timer} from "rxjs";
import {selectIsWaitingForResponse} from "../../store/message/message.selectors";
// import {$localize} from "@angular/localize/init";
import '@angular/localize/init';


@Component({
  selector: 'app-chat-bar',
  templateUrl: './chat-bar.component.html',
  styleUrls: ['./chat-bar.component.scss']
})
export class ChatBarComponent implements OnDestroy {
  store = inject(Store);
  electronService = inject(ElectronService);

  $isWaitingForResponse: Observable<boolean> = this.store
    .select(selectIsWaitingForResponse).pipe(shareReplay(1));
  $isWaitingForInput: Observable<boolean> = this.store
    .select(messageFeature.selectIsWaitingForInput).pipe(shareReplay(1));
  $currentRootPath: Observable<string> = this.store.select(messageFeature.selectCurrentRootPath).pipe(shareReplay(1));

  transcription$: Observable<string>;

  userInput: string | null = '';
  isSendButtonDisabled: boolean = true;
  isDragOver = false;
  files: FileAttachment[] = [];
  isToggledPath: boolean;
  showDirectoryButton: boolean = false; // New property for delayed button visibility
  showRootPath: boolean = false; // New property for delayed root path visibility
  toggledMessage: string = $localize`Hide working directory`;
  untoggledMessage: string = $localize`Show working directory`;

  private transcriptionSubscription: Subscription;

  constructor(private cdr: ChangeDetectorRef) {
    const isToggled = localStorage.getItem('isToggledPath');
    this.isToggledPath = isToggled === 'true';
    this.updateVisibility();
    this.transcription$ = this.store.select('message', 'transcription');

    // Subscription in constructor
    this.transcriptionSubscription = this.transcription$.subscribe(transcription => {
      if (transcription) {
        this.userInput += ' ' + transcription;
        this.isSendButtonDisabled = false;
      }
    });
  }

  ngOnDestroy() {
    // Unsubscribe to prevent memory leaks when component is destroyed
    if (this.transcriptionSubscription) {
      this.transcriptionSubscription.unsubscribe();
    }
  }

  // Method to handle the delayed visibility
  private updateVisibility() {
    if (!this.isToggledPath) {
      timer(300).subscribe(() => {
        this.showDirectoryButton = true;
        this.showRootPath = true;
      });
    } else {
      this.showDirectoryButton = false;
      this.showRootPath = false;
    }
  }

  sendMessageToElectron() {
    const message: Message = {
      messageData: this.userInput!,
      messageActionType: MessageActionType.USER_INPUT,
      sender: Sender.USER,
      attachments: this.files,
    };
    this.store.dispatch(MessageActions.saveMessage({message}));
    this.electronService.sendDataToBackend(
      message.messageData,
      SendMessageActionType.USER_INPUT,
      message.attachments
    );
    this.files = [];
    this.userInput = '';
    this.isSendButtonDisabled = true;
    this.store.dispatch(MessageActions.changeIsWaitingForResponse());
  }

  voiceMessage() {
    this.store.dispatch(MessageActions.changeIsWaitingForInput());
    this.electronService.sendDataToBackend(
      '',
      SendMessageActionType.VOICE_INPUT,
      []
    );
  }

  transcribeToChat() {
    this.store.dispatch(MessageActions.changeIsWaitingForResponse());
    this.electronService.sendDataToBackend(
      '',
      SendMessageActionType.GET_TRANSCRIPTION,
      []
    );
  };



  onUserInputChanged(event: any) {
    const inputValue = event.target.value;
    this.isSendButtonDisabled = !inputValue.trim();
    console.log('isDisabled', this.isSendButtonDisabled);
  }

  fileHover($event: DragEvent) {
    this.isDragOver = true;
    $event.preventDefault();
    $event.stopPropagation();
  }

  fileLeave($event: DragEvent) {
    this.isDragOver = false;
    $event.preventDefault();
    $event.stopPropagation();
  }

  fileDrop($event: DragEvent) {
    this.isDragOver = false;
    $event.preventDefault();
    $event.stopPropagation();

    if ($event.dataTransfer && $event.dataTransfer.files) {
      const files = $event.dataTransfer.files;
      for (const file of Array.from(files)) {
        this.files.push({
          fileName: file.name,
          fileType: file.type,
          filePath: (file as any).path
        });
      }
    }
  }

  attachNewFile() {
    this.electronService.selectFile().subscribe(attachedFiles => {
      console.log('attached files:', attachedFiles);
      for (const attachedFile of attachedFiles) {
        const fileName = attachedFile.split('\\').pop(); // Get the file name from the full path
        const fileExtension = fileName?.split('.').pop(); // Get the file extension
        console.log('attached file:', attachedFile);
        this.files.push({
          fileName: fileName || '',
          fileType: fileExtension || '',
          filePath: attachedFile
        });
      }
    });
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  togglePath() {
    this.isToggledPath = !this.isToggledPath;
    localStorage.setItem('isToggledPath', String(this.isToggledPath));
    this.updateVisibility(); // Update the visibility based on new toggle state
  }

  selectDirectory() {
    const $newDirectory = this.electronService.selectDirectory();
    $newDirectory.subscribe(directory => {
      this.electronService.sendDataToBackend(
        directory[0],
        SendMessageActionType.SET_CURRENT_PATH
      );
    });
  }
}
