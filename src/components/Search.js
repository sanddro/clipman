import React from 'react';

const Search = ({onSearch, searchTerm}) => {

  return (
    <div className="search-block">
      <div className="search-input-wrapper">
        <i className="fa fa-search search-icon"/>
        <input type="text" className="search-input" placeholder="Search..." autoFocus
               value={searchTerm}
               onChange={e => onSearch(e.target.value)}
               onBlur={e => e.target.focus()}
        />
      </div>
    </div>
  );
};

export default Search;