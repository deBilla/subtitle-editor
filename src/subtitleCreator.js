import React, { useState } from "react";
import WebVTT from "node-webvtt";

function SubtitleCreator() {
  const [subtitles, setSubtitles] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [subtitleText, setSubtitleText] = useState("");

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const handleSubtitleTextChange = (event) => {
    setSubtitleText(event.target.value);
  };

  const handleAddSubtitle = () => {
    const newSubtitle = {
      startTime,
      endTime,
      text: subtitleText,
    };
    setSubtitles([...subtitles, newSubtitle]);
    setStartTime("");
    setEndTime("");
    setSubtitleText("");
  };

  const handleGenerateSubtitleFile = () => {
    const parsedSubtitle = {
      cues: [],
      valid: true
    };

    subtitles.forEach((subtitle, index) => {
      const cue = {
        identifier: (index + 1).toString(),
        start: subtitle.startTime,
        end: subtitle.endTime,
        text: subtitle.text,
        styles: ''
      };
      parsedSubtitle.cues.push(cue);
    });

    const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
    const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
      type: "text/vtt",
    });
    const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = "subtitles.vtt";
    a.click();
  };

  return (
    <div>
      <h1>Subtitle Creator</h1>
      <div>
        <input
          type="text"
          placeholder="Start time"
          value={startTime}
          onChange={handleStartTimeChange}
        />
        <input
          type="text"
          placeholder="End time"
          value={endTime}
          onChange={handleEndTimeChange}
        />
        <input
          type="text"
          placeholder="Subtitle text"
          value={subtitleText}
          onChange={handleSubtitleTextChange}
        />
        <button onClick={handleAddSubtitle}>Add Subtitle</button>
      </div>
      <div>
        <h2>Subtitles:</h2>
        {subtitles.map((subtitle, index) => (
          <div key={index}>
            <p>{`[${subtitle.startTime} - ${subtitle.endTime}]: ${subtitle.text}`}</p>
          </div>
        ))}
      </div>
      {subtitles.length > 0 && (
        <div>
          <button onClick={handleGenerateSubtitleFile}>
            Generate Subtitle File
          </button>
        </div>
      )}
    </div>
  );
}

export default SubtitleCreator;
