import React from 'react';

const Search = ({onSearch}) => {

  return (
    <div className="search-block">
      <div className="search-input-wrapper">
        <i className="fa fa-search search-icon"/>
        <input type="text" className="search-input" placeholder="Search..." autoFocus
               onChange={e => onSearch(e.target.value)}
               onBlur={e => e.target.focus()}
        />
      </div>
    </div>
  );
};

export default Search;