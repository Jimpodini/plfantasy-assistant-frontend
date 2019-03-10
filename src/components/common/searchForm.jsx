import React from 'react';

const SearchForm = ({ value, onSearch, style }) => {
	return (
		<input
			style={style}
			onChange={(e) => onSearch(e.currentTarget.value)}
			value={value}
			type="text"
			className="form-control my-3"
			id="searchInput"
			placeholder="Search player or team.."
		/>
	);
};

export default SearchForm;
