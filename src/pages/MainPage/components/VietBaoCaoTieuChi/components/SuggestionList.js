import React, { useState } from 'react';

const SuggestionList = ({ suggestions, onSelect }) => {
  return (
    <ul className="suggestion-list">
      {suggestions.map((item, index) => (
        <li key={index} onClick={() => onSelect(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionList;
