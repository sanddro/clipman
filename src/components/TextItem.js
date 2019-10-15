import React from 'react';
import getHex from '../utils/hex';

const TextItem = ({value}) => {
  let hex = getHex(value);
  return (
    <>
      <i className="far fa-file-alt clip-icon" />
      {hex &&
      <i className="clip-color" style={{backgroundColor: '#' + hex}}/>
      }
      <div className="clip-text" title={value.length > 30 && value}>
        {value}
      </div>
    </>
  );
};

export default TextItem;