import React from 'react';

const SearchForm = ({ value, onSearch }) => {
	return (
		<input
			onChange={(e) => onSearch(e.currentTarget.value)}
			value={value}
			type="text"
			className="form-control my-3"
			id="searchInput"
			placeholder="Search player.."
		/>
	);
};

export default SearchForm;
