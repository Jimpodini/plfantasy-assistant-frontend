import React, { Component } from 'react';

class TableHeader extends Component {
	raiseSort(path) {
		const { sortColumn } = this.props;
		let sortOrder;

		if (sortColumn.path === path) {
			sortOrder = sortColumn.order === 'asc' ? 'desc' : 'asc';
		} else {
			sortOrder = 'asc';
		}
		this.props.onSort({ path: path, order: sortOrder });
	}

	renderSortIcon(column) {
		const { sortColumn } = this.props;
		if (sortColumn.path === column.path) {
			if (sortColumn.order === 'desc') {
				return <i className="fa fa-sort-desc" aria-hidden="true" />;
			} else {
				return <i className="fa fa-sort-asc" aria-hidden="true" />;
			}
		} else {
			return null;
		}
	}

	render() {
		return (
			<thead>
				<tr>
					{this.props.columns.map((column) => (
						<th
							className={column.title === 'Team' || column.title === 'Name' ? 'wideColumn' : ''}
							onClick={() => this.raiseSort(column.path)}
							key={column.key}
						>
							{column.title}
							{this.renderSortIcon(column)}
						</th>
					))}
				</tr>
			</thead>
		);
	}
}

export default TableHeader;
