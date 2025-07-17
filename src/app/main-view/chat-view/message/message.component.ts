import {Component, inject, Input} from '@angular/core';
import {Message, MessageActionType, Sender,} from './../../../shared/interfaces/message.interface'
import {Observable, shareReplay} from "rxjs";
import {selectIsWaitingForResponse} from "../../../store/message/message.selectors";
import {messageFeature} from "../../../store/message";
import {Store} from "@ngrx/store";
import { map } from 'rxjs/operators';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input()
  message: Message | undefined;
  @Input()
  waitingFor: string | undefined;
  store = inject(Store)

  protected readonly ReceiveMessageActionType = MessageActionType;
  protected readonly Sender = Sender;

  parseMessageData(messageData: string): string {
    const urlRegex = /((https?|ftp):\/\/[^\s()<>]+(?:\([\w\d]+\)|([^()\s])*))/g;
    let linkCounter = 0;
    const headerRegex = /\*\*(.*?)\*\*/g;
  
    messageData = messageData.replace(headerRegex, '<b>$1</b>');

    const codeRegex = /```([\s\S]*?)```/g;
    messageData = messageData.replace(codeRegex, '<p><div class="code-container">$1</div></p>');

    const tableRegex = /\|([^|]*)\|([^|]*)\|([^|]*)\|/g;


    messageData = messageData.replace(tableRegex, table => {
      let is_header = true;

      const rows = table.split("\n").filter(row => row.trim() !== ""); // Split by new line and remove empty rows
      const htmlRows = rows.map(row => {
    if (row.replace(" ", '').startsWith("|")) { // Check if it's a table row
        const columns = row.split("|").filter(col => col.trim() !== "");
        if (is_header) {
          is_header = false;
          return `<tr>${columns.map(col => `<th>${col.trim()}</th>`).join("")}</tr>`;
        } // Split by '|' and filter out empty strings
        else {
          return `<tr>${columns.map(col => `<td>${col.trim()}</td>`).join("")}</tr>`;
        }
        
         // Wrap each column with <td>
    }
    return "";
}).join("");// Join all rows into one HTML string
    const finalHtml = `<table>${htmlRows}</table>`;
    return finalHtml; 

    });
    

    return messageData.replace(urlRegex, url => {
      const placeholderId = `link-placeholder-${linkCounter++}`;
      var loc = new URL(url);
      var title = loc.hostname;
      if (url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.gif') || url.endsWith('.bmp') || url.endsWith('.tiff') || url.endsWith('.webp')) {
        return `<p><div class="link-container"><img src="${url}" alt="Image"><a id="${placeholderId}" href="${url}" target="_blank"></a></div></p>`;
      }

      
      const imageSource = `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}`;
      return `<div class="link-container"><img src="${imageSource}"><a id="${placeholderId}" href="${url}" target="_blank">${title}</a></div>`;
    });
  }
  removeExtension(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.');
    return lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  }


}
