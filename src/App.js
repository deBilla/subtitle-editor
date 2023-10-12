import React, { useState, useEffect } from "react";
import WebVTT from "node-webvtt";
import SubtitleCreator from "./subtitleCreator";
import srtParser2 from "srt-parser-2";

function SubtitleItem({ subtitle, onDelete }) {
  return (
    <div>
      <textarea value={subtitle.text} readOnly />
      <button onClick={() => onDelete(subtitle)}>Delete</button>
    </div>
  );
}

function App() {
  const [file, setFile] = useState(null);
  const [subtitles, setSubtitles] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const [showSubtitleCreator, setShowSubtitleCreator] = useState(false);

  const handleOpenSubtitleCreator = () => {
    setShowSubtitleCreator(!showSubtitleCreator);
  };

  const processAndDownload = () => {
    const cues = [];

    for (let i = 0; i < subtitles.length; i++) {
      cues.push({
        identifier: (i + 1).toString(),
        start: subtitles[i].startSeconds,
        end: subtitles[i].endSeconds,
        text: subtitles[i].text,
        styles: "",
      });
    }

    const parsedSubtitle = { cues: cues, valid: true };
    const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
    const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
      type: "text/vtt",
    });
    const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
    const a = document.createElement("a");
    a.href = downloadLink;

    const originalFilename = file.name;
    const fileName = `${originalFilename?.split(".")[0]}.vtt`;

    a.download = `modified_${fileName}`;
    a.click();
  };

  const handleFileUpload = () => {
    if (file) {
      const parser = new srtParser2();
      const reader = new FileReader();
      reader.onload = () => {
        const subtitleData = reader.result;
        const srt_array = parser.fromSrt(subtitleData);
        setSubtitles(srt_array);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  return (
    <div className="container">
      {/* <button onClick={handleOpenSubtitleCreator}>
        {!showSubtitleCreator ? "Create Subtitles" : "Process Subtitles"}
      </button> */}
      <div style={{ display: showSubtitleCreator ? "none" : "block" }}>
        <h1>SRT To VVT Converter</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={processAndDownload}>Process and Download</button>
        {subtitles.map((subtitle) => (
          <SubtitleItem
            key={subtitle.identifier}
            subtitle={subtitle}
            onDelete={() => {}}
          />
        ))}
      </div>
      {/* <div style={{ display: showSubtitleCreator ? "block" : "none" }}>
        <h1>Subtitle App</h1>
        <SubtitleCreator />
      </div> */}
    </div>
  );
}

export default App;
