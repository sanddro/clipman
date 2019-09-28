import React, { useEffect, useState } from 'react';

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
          // Up arrow
          setSelectedClipIdx(selectedClipIdx - 1 >= 0 ? selectedClipIdx - 1 : clips.length - 1);
          break;
        case 'ArrowDown':
          // Down arrow
          setSelectedClipIdx((selectedClipIdx + 1) % clips.length);
          break;
        case 'Enter':
          // Enter
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
    <div>
      <ul>
        {clips.map((clip, idx) =>
          <li key={idx} className={'clip-item' + (idx === selectedClipIdx ? ' selected' : '')} onClick={() => onClipChosen(clip)}>
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