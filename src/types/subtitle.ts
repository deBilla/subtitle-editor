export interface Subtitle {
  id: number;
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export type SubtitleUpdate = Partial<Omit<Subtitle, 'id'>>;
