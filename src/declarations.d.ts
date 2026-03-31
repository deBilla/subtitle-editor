declare module 'node-webvtt' {
  interface VTTCue {
    identifier: string;
    start: number;
    end: number;
    text: string;
    styles: string;
  }

  interface ParsedVTT {
    cues: VTTCue[];
    valid: boolean;
  }

  interface CompileInput {
    cues: VTTCue[];
    valid: boolean;
  }

  function parse(input: string, options?: Record<string, unknown>): ParsedVTT;
  function compile(input: CompileInput): string;
}

declare module 'srt-parser-2' {
  interface SRTEntry {
    id: string;
    startTime: string;
    startSeconds: number;
    endTime: string;
    endSeconds: number;
    text: string;
  }

  export default class SRTParser2 {
    fromSrt(input: string): SRTEntry[];
  }
}
