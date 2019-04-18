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
				return <i className="fa fa-sort-desc" style={{ display: 'inline-block' }} aria-hidden="true" />;
			} else {
				return <i className="fa fa-sort-asc" style={{ display: 'inline-block' }} aria-hidden="true" />;
			}
		} else {
			return null;
		}
	}

	render() {
		return (
			<React.Fragment>
				<colgroup>
					<col style={{ width: '15%' }} />
					<col style={{ width: '12%' }} />
					<col style={{ width: '7%' }} />
					<col style={{ width: '7%' }} />
					<col style={{ width: '7%' }} />
					<col style={{ width: '7%' }} />
					<col style={{ width: '5%' }} />
					<col style={{ width: '8%' }} />
					<col style={{ width: '8%' }} />
					<col style={{ width: '5%' }} />
				</colgroup>
				<thead>
					<tr>
						{this.props.columns.map((column) => (
							<th
								style={{ whiteSpace: 'nowrap' }}
								onClick={() => this.raiseSort(column.path)}
								key={column.key}
							>
								<span style={{ display: 'inline-block' }}>{column.title}</span>
								{this.renderSortIcon(column)}
							</th>
						))}
					</tr>
				</thead>
			</React.Fragment>
		);
	}
}

export default TableHeader;
