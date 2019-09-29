import React from 'react';
import TextItem from './TextItem';
import ImageItem from './ImageItem';
import FileItem from './FileItem';

const ClipItem = ({selected, clip, onClipChosen}) => {
  return (
    <li className={'clip-item' + (selected ? ' selected' : '')} onClick={onClipChosen}>
      {clip.type === 'text' &&
        <TextItem value={clip.value}/>
      }
      {clip.type === 'image' &&
        <ImageItem value={clip.value} />
      }
      {clip.type === 'file' &&
        <FileItem value={clip.value} />
      }
    </li>
  );
};

export default ClipItem;