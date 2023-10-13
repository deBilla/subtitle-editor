export default function SubtitleItem({ subtitle, onDelete }) {
  return (
    <div style={{marginBottom: '5px', borderRadius: '5px', border: '3px dotted #dfbc82'}}>
      <div>{subtitle.id}</div>
      <div>{`${subtitle.startTime} --> ${subtitle.endTime}`}</div>
      <div>{subtitle.text}</div>
      <button style={{marginBottom: '5px', marginTop: '5px', backgroundColor: 'red', color: 'white'}} onClick={() => onDelete(subtitle)}>Delete</button>
    </div>
  );
}