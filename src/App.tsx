import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import SubtitleItem from './components/SubtitleItem';
import { useSubtitles } from './hooks/useSubtitles';
import { useToast } from './hooks/useToast';
import { formatTime } from './utils/util';
import './App.css';

export default function App() {
  const { message: toastMessage, showToast } = useToast();
  const {
    subtitles,
    fileName,
    parseFile,
    deleteSubtitle,
    updateSubtitle,
    shiftSubtitles,
    exportVTT,
    exportSRT,
  } = useSubtitles(showToast);

  const [searchQuery, setSearchQuery] = useState('');
  const [shiftInput, setShiftInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) parseFile(file);
      e.target.value = '';
    },
    [parseFile],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) parseFile(file);
    },
    [parseFile],
  );

  const handleShift = useCallback(() => {
    const seconds = parseFloat(shiftInput);
    if (!Number.isFinite(seconds) || seconds === 0) return;
    shiftSubtitles(seconds);
    setShiftInput('');
  }, [shiftInput, shiftSubtitles]);

  const hasSubtitles = subtitles.length > 0;

  const filteredSubtitles = searchQuery.trim()
    ? subtitles.filter((s) =>
        s.text.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : subtitles;

  const totalDuration =
    subtitles.length > 0
      ? formatTime(subtitles[subtitles.length - 1]?.endSeconds ?? 0)
      : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">◎</div>
          <span className="brand-name">SubEdit</span>
        </div>

        {hasSubtitles && (
          <div className="header-right">
            <span className="stat-chip">
              <strong>{subtitles.length}</strong> subtitles
            </span>
            {totalDuration && (
              <span className="stat-chip">
                <strong>{totalDuration}</strong>
              </span>
            )}
            <span className="stat-chip filename">{fileName}</span>
          </div>
        )}
      </header>

      <main className="app-main">
        {/* Drop Zone */}
        <div
          className={`upload-zone${isDragging ? ' dragging' : ''}${hasSubtitles ? ' has-file' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-visual">
            <span className="upload-visual-icon">🎬</span>
            <p className="upload-title">Drop your subtitle file here</p>
            <p className="upload-sub">SRT and VTT files supported</p>
            <div className="upload-formats">
              <span className="format-badge">.srt</span>
              <span className="format-badge">.vtt</span>
            </div>
          </div>

          {hasSubtitles ? (
            <p className="upload-replace-hint">
              <strong>Drop a new file</strong> to replace — or click to browse
            </p>
          ) : (
            <button
              className="btn-choose"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose File
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".srt,.vtt"
            className="upload-input"
            onChange={handleFileInput}
          />
        </div>

        {/* Toolbar + List */}
        {hasSubtitles && (
          <>
            <div className="toolbar">
              <div className="search-wrap">
                <span className="search-ico">🔍</span>
                <input
                  className="search-input"
                  placeholder="Search subtitle text…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="shift-pill">
                <span className="shift-label">Shift</span>
                <input
                  className="shift-input"
                  type="number"
                  step="0.1"
                  placeholder="±sec"
                  value={shiftInput}
                  onChange={(e) => setShiftInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleShift()}
                />
                <button className="shift-apply" onClick={handleShift}>
                  Apply
                </button>
              </div>

              <div className="export-group">
                <button className="btn btn-vtt" onClick={exportVTT}>
                  ↓ VTT
                </button>
                <button className="btn btn-srt" onClick={exportSRT}>
                  ↓ SRT
                </button>
              </div>
            </div>

            <div className="list-header">
              <span className="list-label">Subtitles</span>
              <span className="list-count">
                {searchQuery.trim() &&
                filteredSubtitles.length !== subtitles.length
                  ? `${filteredSubtitles.length} of ${subtitles.length}`
                  : subtitles.length}
              </span>
            </div>

            <div className="subtitle-list">
              {filteredSubtitles.length > 0 ? (
                filteredSubtitles.map((subtitle) => (
                  <SubtitleItem
                    key={subtitle.id}
                    subtitle={subtitle}
                    onDelete={deleteSubtitle}
                    onUpdate={updateSubtitle}
                  />
                ))
              ) : (
                <div className="no-results">No subtitles match your search</div>
              )}
            </div>
          </>
        )}

        {/* Empty hero */}
        {!hasSubtitles && (
          <div className="empty-hero">
            <span className="empty-glyph">🎞️</span>
            <h2 className="empty-title">Subtitle Editor</h2>
            <p className="empty-body">
              Open an SRT or VTT file to start editing.
              <br />
              Edit text, adjust timestamps, shift timing, and export.
            </p>
          </div>
        )}
      </main>

      {toastMessage && <div className="toast">{toastMessage}</div>}
    </div>
  );
}
