import { useState, useCallback } from 'react';
import * as WebVTT from 'node-webvtt';
import SRTParser2 from 'srt-parser-2';
import { Subtitle, SubtitleUpdate } from '../types/subtitle';
import { formatTimeSRT } from '../utils/util';

interface UseSubtitlesReturn {
  subtitles: Subtitle[];
  fileName: string;
  parseFile: (file: File) => void;
  deleteSubtitle: (id: number) => void;
  updateSubtitle: (id: number, updates: SubtitleUpdate) => void;
  shiftSubtitles: (seconds: number) => void;
  exportVTT: () => void;
  exportSRT: () => void;
}

function renumber(subtitles: Subtitle[]): Subtitle[] {
  return subtitles.map((s, i) => ({ ...s, id: i + 1 }));
}

function triggerDownload(content: string, name: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function useSubtitles(
  onMessage: (msg: string) => void,
): UseSubtitlesReturn {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [fileName, setFileName] = useState('');

  const parseFile = useCallback(
    (file: File) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const reader = new FileReader();

      reader.onload = () => {
        const raw = reader.result as string;
        try {
          let parsed: Subtitle[];
          if (ext === 'srt') {
            parsed = new SRTParser2().fromSrt(raw).map((entry, i) => ({
              id: i + 1,
              startSeconds: entry.startSeconds,
              endSeconds: entry.endSeconds,
              text: entry.text,
            }));
          } else {
            parsed = WebVTT.parse(raw).cues.map((cue, i) => ({
              id: i + 1,
              startSeconds: cue.start,
              endSeconds: cue.end,
              text: cue.text,
            }));
          }
          setSubtitles(parsed);
          setFileName(file.name);
          onMessage(`Loaded "${file.name}" — ${parsed.length} subtitles`);
        } catch {
          onMessage('Could not parse file. Make sure it is a valid SRT or VTT.');
        }
      };

      reader.readAsText(file);
    },
    [onMessage],
  );

  const deleteSubtitle = useCallback((id: number) => {
    setSubtitles((prev) => renumber(prev.filter((s) => s.id !== id)));
  }, []);

  const updateSubtitle = useCallback((id: number, updates: SubtitleUpdate) => {
    setSubtitles((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    );
  }, []);

  const shiftSubtitles = useCallback(
    (seconds: number) => {
      setSubtitles((prev) =>
        prev.map((s) => ({
          ...s,
          startSeconds: Math.max(0, s.startSeconds + seconds),
          endSeconds: Math.max(0, s.endSeconds + seconds),
        })),
      );
      onMessage(
        `Shifted ${subtitles.length} subtitles by ${seconds > 0 ? '+' : ''}${seconds}s`,
      );
    },
    [subtitles.length, onMessage],
  );

  const exportVTT = useCallback(() => {
    const cues = subtitles.map((s, i) => ({
      identifier: String(i + 1),
      start: s.startSeconds,
      end: s.endSeconds,
      text: s.text,
      styles: '',
    }));
    const content = WebVTT.compile({ cues, valid: true });
    const base = fileName.split('.')[0] ?? 'subtitles';
    triggerDownload(content, `${base}_modified.vtt`, 'text/vtt');
    onMessage('Exported as VTT');
  }, [subtitles, fileName, onMessage]);

  const exportSRT = useCallback(() => {
    const content =
      subtitles
        .map(
          (s, i) =>
            `${i + 1}\n${formatTimeSRT(s.startSeconds)} --> ${formatTimeSRT(s.endSeconds)}\n${s.text}`,
        )
        .join('\n\n') + '\n';
    const base = fileName.split('.')[0] ?? 'subtitles';
    triggerDownload(content, `${base}_modified.srt`, 'text/plain');
    onMessage('Exported as SRT');
  }, [subtitles, fileName, onMessage]);

  return {
    subtitles,
    fileName,
    parseFile,
    deleteSubtitle,
    updateSubtitle,
    shiftSubtitles,
    exportVTT,
    exportSRT,
  };
}
