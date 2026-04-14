export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
}

export type NoteTag = "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
