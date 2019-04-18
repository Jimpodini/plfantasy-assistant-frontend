import React from 'react';
import _ from 'lodash';

const Pagination = ({ pageSize, numberOfItems, currentPage, onPageChange, numberOfFilteredItems }) => {
	const nrOfPages = Math.ceil(numberOfItems / pageSize);
	const nrOfActivePages = Math.ceil(numberOfFilteredItems / pageSize);
	const pages = _.range(1, nrOfPages + 1);

	return (
		<nav>
			<ul className="pagination">
				{pages.map((page) => (
					<li key={page} className={page > nrOfActivePages ? 'page-item disabled' : 'page-item'}>
						<a
							onClick={() => onPageChange(page)}
							className={page === currentPage ? 'page-link active' : 'page-link'}
						>
							{page}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Pagination;
