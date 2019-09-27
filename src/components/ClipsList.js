import React from 'react';

const ClipsList = ({clips, onClipChosen}) => {
  return (
    <div>
      <ul>
        {clips.map((clip, idx) =>
          <li key={idx} className="clip-item" onClick={() => onClipChosen(clip)}>
            <div className="clip-text" title={clip}>
              {clip}
            </div>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ClipsList;