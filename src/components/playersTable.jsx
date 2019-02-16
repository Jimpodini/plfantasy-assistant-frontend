import React, { Component } from 'react';
import Table from './common/table';
import Like from './common/like';
import HoverDiv from './common/hoverDiv';

class PlayersTable extends Component {
	columns = [
		{ key: 'name', title: 'Name', path: 'full_name' },
		{ key: 'team', title: 'Team', path: 'team_name' },
		{ key: 'odds', title: 'Odds', path: 'odds_to_win_next_match' },
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
		const { players } = this.props;

		return <Table data={players} columns={this.columns} />;
	}
}

export default PlayersTable;
