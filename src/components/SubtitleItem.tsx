import { useState, useEffect } from 'react';
import { Subtitle, SubtitleUpdate } from '../types/subtitle';
import { formatTime, parseTime } from '../utils/util';

interface Props {
  subtitle: Subtitle;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: SubtitleUpdate) => void;
}

export default function SubtitleItem({ subtitle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(subtitle.text);
  const [startTime, setStartTime] = useState(formatTime(subtitle.startSeconds));
  const [endTime, setEndTime] = useState(formatTime(subtitle.endSeconds));

  // Sync display values when the subtitle changes externally (e.g. time shift)
  useEffect(() => {
    if (!editing) {
      setText(subtitle.text);
      setStartTime(formatTime(subtitle.startSeconds));
      setEndTime(formatTime(subtitle.endSeconds));
    }
  }, [subtitle, editing]);

  const handleSave = () => {
    const startSeconds = parseTime(startTime);
    const endSeconds = parseTime(endTime);

    if (startSeconds === null || endSeconds === null) {
      alert('Invalid time format. Use HH:MM:SS.mmm');
      return;
    }

    onUpdate(subtitle.id, { text, startSeconds, endSeconds });
    setEditing(false);
  };

  const handleCancel = () => {
    setText(subtitle.text);
    setStartTime(formatTime(subtitle.startSeconds));
    setEndTime(formatTime(subtitle.endSeconds));
    setEditing(false);
  };

  return (
    <div className={`subtitle-card${editing ? ' is-editing' : ''}`}>
      <div className="card-header">
        <span className="subtitle-index">#{subtitle.id}</span>

        <div className="time-section">
          {editing ? (
            <div className="time-edit-row">
              <input
                className="time-field"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="00:00:00.000"
              />
              <span className="time-sep">→</span>
              <input
                className="time-field"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="00:00:00.000"
              />
            </div>
          ) : (
            <button
              className="time-pill"
              onClick={() => setEditing(true)}
              title="Click to edit timestamps"
            >
              {formatTime(subtitle.startSeconds)} → {formatTime(subtitle.endSeconds)}
            </button>
          )}
        </div>

        <div className="card-actions">
          {editing ? (
            <>
              <button className="btn-card btn-card-save" onClick={handleSave}>
                Save
              </button>
              <button className="btn-card btn-card-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-card btn-card-edit"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn-card btn-card-del"
                onClick={() => onDelete(subtitle.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-body">
        {editing ? (
          <textarea
            className="sub-textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={Math.max(2, (text.match(/\n/g)?.length ?? 0) + 1)}
            autoFocus
          />
        ) : (
          <p
            className="sub-text clickable"
            onDoubleClick={() => setEditing(true)}
            title="Double-click to edit"
          >
            {subtitle.text}
          </p>
        )}
      </div>
    </div>
  );
}
