export interface Message {
  sender: Sender;
  messageActionType: MessageActionType;
  messageData: string;
  attachments: FileAttachment[];
}
export enum Sender {
  USER = 'user',
  INTERFACE = 'interface',
}
export enum MessageActionType {
  USER_INPUT = 'user_input',
  VOICE_INPUT = 'voice_input',
  LISTENING_ENDED = 'listening_ended',
  TRANSCRIPTION_ENDED = 'transcription_ended',
  BOT_RESPONSE = 'bot_response',
  BOT_INIT = 'init',
  GET_CURRENT_PATH = 'get_current_path',
  SETTINGS = 'settings',
  RAG_TOOLS = 'ragtools',
  SET_CURRENT_PATH = 'set_current_path',
}
export interface FileAttachment {
  fileName: string;
  fileType: string;
  filePath: string;
}
