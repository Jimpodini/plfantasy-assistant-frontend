import React, { Component } from 'react';
import _ from 'lodash';

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
							<td style={{ whiteSpace: 'nowrap', overflow: 'hidden' }} key={this.createKey(item, column)}>
								{this.renderCell(item, column)}
							</td>
						))}
						{/* <td>{player.full_name}</td>
						<td>{player.team_name}</td>
						<td>{player.odds_to_win_next_match}</td>
						<td>{player.will_start}</td>
						<td>{player.will_start_fantasy_scout}</td>
						<td>
							<Like liked={player.liked} onClick={() => this.handleLike(player)} />
						</td> */}
					</tr>
				))}
			</tbody>
		);
	}
}

export default TableBody;
