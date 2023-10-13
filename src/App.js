import React, { useState, useEffect } from "react";
import WebVTT from "node-webvtt";
import srtParser2 from "srt-parser-2";
import SubtitleItem from "./components/subtitleItem";
import "./subtitle-creator/SubtitleCreator.css";

function App() {
  const [file, setFile] = useState(null);
  const [subtitles, setSubtitles] = useState([]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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

  const handleFileUpload = (srtFile) => {
    if (srtFile) {
      const parser = new srtParser2();
      const reader = new FileReader();
      reader.onload = () => {
        const subtitleData = reader.result;
        const srt_array = parser.fromSrt(subtitleData);
        setSubtitles(srt_array);
      };
      reader.readAsText(srtFile);
    }
  };

  const oneDeleteSubtitle = () => {
    alert("not supported yet");
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  return (
    <div className="container">
      <h1>SRT To VVT Converter</h1>
      <div>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <input type="file" onChange={handleFileChange} />
          <button onClick={processAndDownload}>Process and Download</button>
        </div>
      </div>
      <div style={{ marginTop: "10px" }}>
        {subtitles.map((subtitle) => (
          <SubtitleItem
            key={subtitle.identifier}
            subtitle={subtitle}
            onDelete={oneDeleteSubtitle}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
