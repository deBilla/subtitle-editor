import React, { useState } from "react";
import WebVTT from "node-webvtt";
import SubtitleCreator from "./subtitleCreator";

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

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const subtitleData = reader.result;
        const parsedSubtitle = WebVTT.parse(subtitleData);
        let cueArr = parsedSubtitle.cues.slice(11);

        for (let i = 0; i < cueArr.length; i++) {
          cueArr[i]["identifier"] = (i + 1).toString();
        }

        parsedSubtitle.cues = cueArr;

        const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
        const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], {
          type: "text/vtt",
        });
        const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
        const a = document.createElement("a");
        a.href = downloadLink;

        const originalFilename = file.name;

        a.download = `modified_${originalFilename}`;
        a.click();

        setSubtitles(cueArr);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container">
      <button onClick={handleOpenSubtitleCreator}>{!showSubtitleCreator ? 'Create Subtitles' : 'Process Subtitles'}</button>
      <div style={{ display: showSubtitleCreator ? "none" : "block" }}>
        <h1>Subtitle File Processor</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Process and Download</button>
        {subtitles.map((subtitle) => (
          <SubtitleItem
            key={subtitle.identifier}
            subtitle={subtitle}
            onDelete={() => {}}
          />
        ))}
      </div>
      <div style={{ display: showSubtitleCreator ? "block" : "none" }}>
        <h1>Subtitle App</h1>
        <SubtitleCreator />
      </div>
    </div>
  );
}

export default App;
