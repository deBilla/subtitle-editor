import React, { useState } from 'react';
import WebVTT from 'node-webvtt';

function App() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const subtitleData = reader.result;
        const parsedSubtitle = WebVTT.parse(subtitleData);
        let cueArr = parsedSubtitle.cues.slice(11);

        for (let i =0; i<cueArr.length; i++) {
            cueArr[i]['identifier'] = (i+1).toString();
        }

        parsedSubtitle.cues = cueArr;

        const modifiedSubtitleContent = WebVTT.compile(parsedSubtitle);
        const modifiedSubtitleBlob = new Blob([modifiedSubtitleContent], { type: 'text/vtt' });
        const downloadLink = URL.createObjectURL(modifiedSubtitleBlob);
        const a = document.createElement('a');
        a.href = downloadLink;

        const originalFilename = file.name;

        a.download = `modified_${originalFilename}`;
        a.click();
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h1>Subtitle File Processor</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Process and Download</button>
    </div>
  );
}

export default App;
