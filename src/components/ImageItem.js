import React from 'react';

const ImageItem = ({value}) => {
  return (
    <>
      <i className="far fa-file-image clip-icon image" />
      <img className="clip-image" src={value}  alt=""/>
    </>
  );
};

export default ImageItem;