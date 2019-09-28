import React from 'react';
import getHex from '../utils/hex';

const ClipItem = ({selected, clip, onClipChosen}) => {

  let hex = getHex(clip);

  return (
    <li className={'clip-item' + (selected ? ' selected' : '')} onClick={onClipChosen}>
      <i className="far fa-file-alt clip-text-icon" />
      {hex &&
      <i className="clip-color" style={{backgroundColor: '#' + hex}}/>
      }
      <div className="clip-text" title={clip}>
        {clip}
      </div>
    </li>
  );
};

export default ClipItem;