import {Injectable} from '@angular/core';
import {catchError, from, Observable, Subject} from 'rxjs';
import {FileAttachment} from "../../interfaces/message.interface";

declare global {
  interface Window {
    electron: {
      receiveDataFromBackend: (callback: (data: string) => void) => void;
      receiveReturnCodeFromBackend: (callback: (code: number) => void) => void;
      selectDirectory: () => Promise<string[]>;
      sendDataToBackend: (data: string) => void;
      selectFile: () => Promise<string[]>;
    };
  }
}

export enum SendMessageActionType {
  GET_TRANSCRIPTION = 'get_transcription',
  USER_INPUT = 'user_input',
  VOICE_INPUT = 'voice_input',
  SETTINGS_CHANGE = 'settings_change',
  SET_CURRENT_PATH = 'set_current_path',
  MESSAGE_TO_READ = 'message_to_read',
  SAVE_RAG_TOOLS = 'save_rag_tools',
}
@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private dataSubject = new Subject<string | null>();
  private codeSubject = new Subject<number | null>();
  constructor() {
    window.electron.receiveDataFromBackend((data: string) => {
      this.dataSubject.next(data);
    });
    window.electron.receiveReturnCodeFromBackend((code: number) => {
      console.log(code);
      if (code == 1) {
        this.codeSubject.next(code);
      }
    });
  }
  sendDataToBackend(data: string, actionType: SendMessageActionType, attachments: FileAttachment[] = []) {
    console.log('Data send to backend:', data);
    const attachmentsData: string[] = []
    attachments.forEach((fileAttachment: FileAttachment) => {
      attachmentsData.push(fileAttachment.filePath)
    })
    let sender_msg = `${actionType}#@${data}`;
    if (attachmentsData.length > 0) {
      sender_msg += `\nAttachments: ${attachmentsData.join("\n")}`;
    }


    sender_msg = sender_msg.replace(/\n/g, "###NEW_LINE###");
    console.log("FINAL_MESSAGE: ", sender_msg);
    window.electron.sendDataToBackend(sender_msg);
  }

  get data$(): Observable<string | null> {
    return this.dataSubject.asObservable();
  }

  get code$(): Observable<number | null> {
    return this.codeSubject.asObservable();
  }

  selectDirectory(): Observable<string[]> {
    return from(window.electron.selectDirectory()).pipe(
      catchError(error => {
        console.error('Error selecting directory', error);
        throw error;
      })
    );
  }

  selectFile(): Observable<string[]> {

    return from(window.electron.selectFile()).pipe(
      catchError(error => {
        console.error('Error selecting file', error);
        throw error;
      })
    );
  }
}
