import React from 'react';

const FileItem = ({value}) => {

  const filePath = process.platform !== 'darwin'
    ? value.replace(new RegExp(String.fromCharCode(0), 'g'), '')
    : value.replace('file://', '');

  const parts = process.platform === 'darwin' ? filePath.split('/') : filePath.split('\\');
  const filename = parts[parts.length - 1];

  return (
    <>
      <i className="fa fa-file clip-icon file" />
      <div className="clip-text" title={filePath}>
        {filename} - {filePath}
      </div>
    </>
  );
};

export default FileItem;