import React, { Component } from 'react';
import Table from './common/table';
import Like from './common/like';
import HoverDiv from './common/hoverDiv';

class PlayersTable extends Component {
	columns = [
		{ key: 'name', title: 'Name', path: 'full_name' },
		{ key: 'team', title: 'Team', path: 'team_name' },
		{ key: 'position', title: 'Position', path: 'position' },
		{ key: 'price', title: 'Price (£)', path: 'now_cost' },
		{ key: 'ict_index', title: 'ICT Index', path: 'ict_index' },
		{
			key: 'odds',
			title: <HoverDiv text="Odds" hoverText="Source: Bet365" />,
			path: 'odds_to_win_next_match'
		},
		{
			key: 'starter_1',
			title: <HoverDiv text="Starter 1" hoverText="Source: https://www.rotowire.com/soccer/lineups.php" />,
			path: 'will_start_rotowire'
		},
		{
			key: 'starter_2',
			title: <HoverDiv text="Starter 2" hoverText="Source: https://www.fantasyfootballscout.co.uk/team-news/" />,
			path: 'will_start_fantasy_scout'
		},
		{
			key: 'like',
			content: (player) => <Like liked={player.liked} onClick={() => this.props.onLike(player)} />
		}
	];

	render() {
		const { players, onSort, sortColumn } = this.props;

		return <Table data={players} columns={this.columns} sortColumn={sortColumn} onSort={onSort} />;
	}
}

export default PlayersTable;
