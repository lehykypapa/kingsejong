export interface AvatarOption {
  id: string;
  label: string;
  subtitle: string;
  imageUrl: string;
  jamoMark: string;
}

export interface StudentProfile {
  name: string;
  avatarId: string;
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "sejong";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  isUnread?: boolean;
}

export interface QuickQuestion {
  id: string;
  label: string;
  prompt: string;
}

export interface JamoCategory {
  id: string;
  jamo: string;
  title: string;
  subtitle: string;
  accentBg: string;
  accentText: string;
  questions: QuickQuestion[];
}

export interface JamoSticker {
  id: string;
  jamo: string;
  title: string;
  message: string;
}
