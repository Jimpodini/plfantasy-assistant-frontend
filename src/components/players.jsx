import React, { Component } from 'react';
import http from '../services/httpService';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import SearchForm from './common/searchForm';
import Like from './common/like';
import { teams } from '../services/extractTeamService';
import { getGames } from '../services/extractOddsService';

//import { playerWillStart } from '../services/expectedLineupService';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://fantasy.premierleague.com/drf/elements/';
const apiTeamsUrl = 'https://fantasy.premierleague.com/drf/teams/';

const rp = require('request-promise');
const url = 'https://www.rotowire.com/soccer/lineups.php';

class Players extends Component {
	state = {
		players: [],
		pageSize: 40,
		currentPage: 1,
		searchQuery: ''
	};

	getPlayers = () => {
		return http.get(proxyUrl + apiUrl);
	};

	getTeams = () => {
		return http.get(proxyUrl + apiTeamsUrl);
	};

	getPagedData = () => {
		// items, pageNumber, pageSize
		const { pageSize, currentPage, players: allPlayers, searchQuery } = this.state;

		let filtered = allPlayers;
		if (searchQuery) {
			filtered = allPlayers.filter((player) =>
				player.full_name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}
		const players = paginate(filtered, currentPage, pageSize);

		return { players, totalCount: filtered.length };
	};

	async componentDidMount() {
		// these are independent and should be run concurrently
		let players = await this.getPlayers();
		const rotowireLineups = await this.getLineupRotowire();
		const fantasyScoutLineups = await this.getLineupFantasyScout();

		players = players.data;
		players.map((player) => this.setPlayerAttributes(player, rotowireLineups, fantasyScoutLineups));
		this.setState({ players });

		// console.log(fantasyScoutLineups);
		// console.log(this.willStart('title="Ozil', 'title="Ozil', fantasyScoutLineups));
	}

	getLineupRotowire = () => {
		return rp(proxyUrl + url);
	};

	getLineupFantasyScout = () => {
		return rp(proxyUrl + 'https://www.fantasyfootballscout.co.uk/team-news/');
	};

	willStart = (team, name, rotowireLineups) => {
		if (rotowireLineups.includes(`${team}`)) {
			if (rotowireLineups.includes(`${name}`)) {
				//return 'Yes';
				//console.log('team and name found');
				return 'Yes';
			} else {
				return 'No';
			}
		} else {
			return 'N/A';
		}
	};

	setPlayerAttributes = (player, rotowireLineups, fantasyScoutLineups) => {
		player['full_name'] = player.first_name + ' ' + player.second_name;

		const teamName = teams[player.team - 1].oddsName;
		player['team_name'] = teamName;

		const index = getGames(teamName)[0].teams.indexOf(teamName);
		const oddsIndex = index === 0 ? 0 : 2;
		player['odds_to_win_next_match'] = getGames(teamName)[0].sites[0].odds.h2h[oddsIndex];

		player['will_start'] = this.willStart(teamName, player.second_name, rotowireLineups);

		player['will_start_fantasy_scout'] = this.willStart(
			teamName,
			`title="${player.second_name}`,
			fantasyScoutLineups
		);

		//player['will_start'] = this.willStart('games', 'games', rotowireLineups);
	};

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handleSearch = (query) => {
		this.setState({ searchQuery: query, currentPage: 1 });
	};

	handleLike = (player) => {
		const players = [ ...this.state.players ];
		const index = players.indexOf(player);

		players[index] = { ...players[index] };

		players[index].liked = !players[index].liked;
		console.log(players[index].liked);
		this.setState({ players });
	};

	render() {
		const { pageSize, currentPage, searchQuery } = this.state;

		const { players, totalCount } = this.getPagedData();

		return (
			<React.Fragment>
				<SearchForm value={searchQuery} onSearch={this.handleSearch} />
				<Pagination
					pageSize={pageSize}
					numberOfItems={totalCount}
					currentPage={currentPage}
					onPageChange={this.handlePageChange}
				/>
				<div>
					<table className="table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Team</th>
								<th>Odds to win next game</th>
								<th className="hoverWrapper">
									Starter
									<div id="hoverShow1">1) this is shown only on hover</div>
								</th>
								<th>Starter scout</th>
								<th />
							</tr>
						</thead>
						<tbody>
							{players.map((player) => (
								<tr key={player.id}>
									<td>{player.full_name}</td>
									<td>{player.team_name}</td>
									<td>{player.odds_to_win_next_match}</td>
									<td>{player.will_start}</td>
									<td>{player.will_start_fantasy_scout}</td>
									<td>
										<Like liked={player.liked} onClick={() => this.handleLike(player)} />
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</React.Fragment>
		);
	}
}

export default Players;
