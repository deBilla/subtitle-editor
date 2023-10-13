const handleFileUploadForRemovingFirst11Subs = () => {
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const subtitleData = reader.result;
      const parsedSubtitle = WebVTT.parse(subtitleData);

      // removing first 11 subs
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

export const parseFileVTT = (file) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const subtitleData = reader.result;
      const parsedSubtitle = WebVTT.parse(subtitleData);

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
}
