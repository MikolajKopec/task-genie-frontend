import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  inject,
  OnDestroy, ViewChild,
} from '@angular/core';
import {Message, MessageActionType, Sender,} from '../../shared/interfaces/message.interface';
import { Store } from '@ngrx/store';
import {Observable, shareReplay, Subscription} from 'rxjs';
import { messageFeature } from '../../store/message';
import {selectIsWaitingForResponse} from "../../store/message/message.selectors";

@Component({
  selector: 'app-chat-view',
  templateUrl: './chat-view.component.html',
  styleUrl: './chat-view.component.scss'
})
export class ChatViewComponent implements AfterViewInit, OnDestroy{
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  store = inject(Store);

  $isWaitingForResponse:Observable<boolean> = this.store
    .select(selectIsWaitingForResponse).pipe(shareReplay(1))
  $isWaitingForInput:Observable<boolean> = this.store
    .select(messageFeature.selectIsWaitingForInput).pipe(shareReplay(1))


  responseMessages: Message[] = [];
  responseMessagesSub: Subscription = new Subscription();
  systemMessages: Message[] = [];
  systemMessagesSub: Subscription = new Subscription();


  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    this.responseMessagesSub = this.store
      .select(messageFeature.selectResponseMessages)
      .subscribe((messages) => {
        this.responseMessages = messages;
        console.log('Chat view response messages:', messages);
        this.scrollChatToBottom();
      });
    this.systemMessagesSub = this.store
      .select(messageFeature.selectSystemMessages)
      .subscribe((messages) => {
        this.systemMessages = messages;
        console.log('Chat view system messages:', messages);
        this.scrollChatToBottom();
      });
  }

  protected scrollChatToBottom(): void {
    this.cdr.detectChanges();  // Ensure the view is updated
    setTimeout(() => {
      try {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
        console.log('Successfully scrolled to bottom');
      } catch (err) {
        console.error('Error scrolling to bottom:', err);
      }
    }, 1);  // Delay scrolling to allow message rendering
  }
  ngOnDestroy() {
    this.responseMessagesSub.unsubscribe();
    this.systemMessagesSub.unsubscribe();
  }

  protected readonly Sender = Sender;
}
