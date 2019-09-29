import React, { useEffect, useState } from 'react';
import ClipItem from './ClipItem';

const ClipsList = ({clips, onClipChosen}) => {
  const [selectedClipIdx, setSelectedClipIdx] = useState(0);

  function scrollToItem(itemIdx) {
    const constItems = document.querySelectorAll('.clip-item');
    if (constItems[itemIdx])
      constItems[itemIdx].scrollIntoView({ block: 'nearest' });
  }

  scrollToItem(selectedClipIdx);

  useEffect(() => {
    setSelectedClipIdx(0);
  }, [clips, onClipChosen]);

  useEffect(() => {

    document.onkeydown = function(event) {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedClipIdx(selectedClipIdx - 1 >= 0 ? selectedClipIdx - 1 : clips.length - 1);
          break;
        case 'ArrowDown':
          setSelectedClipIdx((selectedClipIdx + 1) % clips.length);
          break;
        case 'Enter':
          onClipChosen(clips[selectedClipIdx]);
          break;
        default:
          break;
      }
    };
    return () => {
      document.onkeydown = undefined;
    }
  }, [clips, selectedClipIdx, onClipChosen]);

    return (
    <div className="clip-list">
      {clips.length
        ?
        <ul>
          {clips.map((clip, idx) =>
            <ClipItem key={idx} clip={clip} selected={idx === selectedClipIdx} onClipChosen={() => onClipChosen(clip)}/>
          )}
        </ul>
        : <div className="no-clips">No clips found</div>
      }
    </div>
  );
};

export default ClipsList;