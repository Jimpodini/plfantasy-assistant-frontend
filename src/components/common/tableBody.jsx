import React, { Component } from 'react';
import _ from 'lodash';
import HoverDiv from '../common/hoverDiv';

class TableBody extends Component {
	renderCell(item, column) {
		if (column.content) {
			return column.content(item);
		}

		return _.get(item, column.path);
	}

	createKey = (item, column) => {
		return item.id + (column.path || column.key);
	};

	render() {
		const { data, columns } = this.props;

		return (
			<tbody>
				{data.map((item) => (
					<tr key={item.id}>
						{columns.map((column) => (
							<td
								//onMouseOver={() => console.log(item.games_info)}
								style={{ whiteSpace: 'nowrap', overflow: 'hidden', width: 'auto' }}
								key={this.createKey(item, column)}
							>
								{column.key === 'avg_difficulty' ? (
									<HoverDiv
										text={this.renderCell(item, column)}
										hoverText={item.games_info}
										style={item.styling}
									/>
								) : (
									this.renderCell(item, column)
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		);
	}
}

export default TableBody;
