import React from 'react';
import _ from 'lodash';

const Pagination = ({ pageSize, numberOfItems, currentPage, onPageChange }) => {
	// pageSize
	// numberOfItems
	// integer nrOfPages = numberOfItems/pageSize
	// currentPage

	const nrOfPages = Math.ceil(numberOfItems / pageSize);
	const pages = _.range(1, nrOfPages + 1);

	return (
		<nav>
			<ul className="pagination pagination-lg">
				{pages.map((page) => (
					<li key={page} className={page === currentPage ? 'page-item active' : 'page-item'}>
						<a onClick={() => onPageChange(page)} className="page-link">
							{page}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Pagination;
