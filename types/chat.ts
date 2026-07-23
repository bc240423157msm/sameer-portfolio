export interface ChatAttachment {
  type: "image" | "video";
  name: string;
  dataUrl: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  attachment?: ChatAttachment;
}

export interface ChatApiMessage {
  role: "user" | "assistant" | "system";
  content: string | ChatContentPart[];
}

export interface ChatContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: { url: string };
}
