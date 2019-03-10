import React, { Component } from 'react';
import http from '../services/httpService';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import SearchForm from './common/searchForm';
import { teams } from '../services/extractTeamService';
import PlayersTable from './playersTable';
import _ from 'lodash';
import LoadingSpinner from './common/loadingSpinner';
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
		searchQuery: '',
		sortColumn: { path: 'full_name', order: 'asc' },
		filterLiked: false,
		isLoading: true
	};

	async populateOdds() {
		try {
			http.post('http://localhost:3900/api/odds');
			console.log('populateOdds called');
		} catch (ex) {
			console.log(ex.message);
		}
	}

	getPlayers = () => {
		return http.get(proxyUrl + apiUrl);
	};

	getTeams = () => {
		return http.get(proxyUrl + apiTeamsUrl);
	};

	getPagedData = () => {
		// items, pageNumber, pageSize
		const { pageSize, currentPage, players: allPlayers, searchQuery, filterLiked } = this.state;

		let filtered = allPlayers;

		if (searchQuery) {
			filtered = allPlayers.filter(
				(player) =>
					player.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					player.team_name.toLowerCase().includes(searchQuery.toLowerCase())
			);
		}

		if (filterLiked) {
			filtered = filtered.filter((player) => player.liked);
		}

		let sorted = _.orderBy(filtered, [ this.state.sortColumn.path ], [ this.state.sortColumn.order ]);
		const players = paginate(sorted, currentPage, pageSize);

		return { players, totalCount: allPlayers.length, filteredCount: filtered.length };
	};

	async componentDidMount() {
		try {
			const playersPromise = this.getPlayers();
			const rotowireLineupsPromise = this.getLineupRotowire();
			const fantasyScoutLineupsPromise = this.getLineupFantasyScout();
			const latestUpdatePromise = http.get('http://localhost:3900/api/updates');
			//const oddsPromise = this.getOdds();

			let [ players, rotowireLineups, fantasyScoutLineups, latestUpdate ] = await Promise.all([
				playersPromise,
				rotowireLineupsPromise,
				fantasyScoutLineupsPromise,
				latestUpdatePromise
			]);

			//console.log(latestUpdate.data.lastUpdated);

			// let [ players, rotowireLineups, fantasyScoutLineups, odds ] = await Promise.all([
			// 	playersPromise,
			// 	rotowireLineupsPromise,
			// 	fantasyScoutLineupsPromise,
			// 	oddsPromise
			// ]

			const lastUpdatedString = latestUpdate.data.lastUpdated.substr(0, 10);
			const currentDate = new Date().toISOString().slice(0, 10);
			const oddsUpdatedToday = lastUpdatedString === currentDate ? true : false;

			if (!oddsUpdatedToday) this.populateOdds();

			const odds = await http.get('http://localhost:3900/api/odds');

			players = players.data;
			// players.map((player) => this.setPlayerAttributes(player, rotowireLineups, fantasyScoutLineups, odds));
			players.map((player) => this.setPlayerAttributes(player, rotowireLineups, fantasyScoutLineups, odds));

			this.setState({ players, isLoading: false });
		} catch (err) {
			console.log(err.message);
		}
	}

	getLineupRotowire = () => {
		return rp(proxyUrl + url);
	};

	getLineupFantasyScout = () => {
		return rp(proxyUrl + 'https://www.fantasyfootballscout.co.uk/team-news/');
	};

	willStart = (team, name, lineup) => {
		if (lineup.includes(`${team}`)) {
			if (lineup.includes(`${name}`)) {
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

	async setPlayerAttributes(player, rotowireLineups, fantasyScoutLineups, odds) {
		player['full_name'] = player.first_name + ' ' + player.second_name;

		const teamNameOddsAPI = teams[player.team - 1].oddsName;
		player['team_name'] = teamNameOddsAPI;

		//console.log(odds.data.data);
		// const oddsForTeam = odds.data.data.filter((o) => o.teams.includes(teamNameOddsAPI))[0];
		// console.log(oddsForTeam);
		// console.log(oddsForTeam[0]);

		// const nextGame = getGames(teamNameOddsAPI)[0];
		// const index = nextGame.teams.indexOf(teamNameOddsAPI);
		// const bet365 = nextGame.sites.filter((s) => s['site_key'] === 'bet365');

		//const jimodds = this.getOdds();

		const allGames = odds.data;
		const myNextGame = allGames.filter((game) => game.teams.includes(teamNameOddsAPI))[0];
		const index = myNextGame.teams.indexOf(teamNameOddsAPI);
		const oddsToWin = myNextGame.odds[index];
		player['odds_to_win_next_match'] = oddsToWin;

		const positionId = player.element_type;
		let position;
		switch (positionId) {
			case 1:
				position = 'GK';
				break;
			case 2:
				position = 'DEF';
				break;
			case 3:
				position = 'MID';
				break;
			case 4:
				position = 'FWD';
				break;
		}
		player['position'] = position;

		// console.log(myNextGame);

		// const oddsForTeam = odds.data.data.filter((o) => o.teams.includes(teamNameOddsAPI))[0];
		// const index = oddsForTeam.teams.indexOf(teamNameOddsAPI);
		// const bet365 = oddsForTeam.sites.filter((s) => s['site_key'] === 'bet365');
		//const currentDate = new Date();
		//console.log(latestUpdate.substr(0, 10) === currentDate.substr(0, 10));

		// if (bet365[0] != null) {
		// 	const bet365odds = bet365[0].odds.h2h[index];
		// 	//const oddsIndex = index === 0 ? 0 : 2;
		// 	//const bet365index = getGames(teamNameOddsAPI)[0].sites.indexOf()
		// 	//player['odds_to_win_next_match'] = getGames(teamNameOddsAPI)[0].sites[0].odds.h2h[index];
		// 	player['odds_to_win_next_match'] = bet365odds;
		// }

		const teamNameRotowire = teams[player.team - 1].rotowireName;
		player['will_start_rotowire'] = this.willStart(teamNameRotowire, player.second_name, rotowireLineups);

		player['will_start_fantasy_scout'] = this.willStart(
			teamNameOddsAPI,
			`title="${player.second_name}`,
			fantasyScoutLineups
		);

		player['now_cost'] = player['now_cost'] / 10;

		//player['will_start'] = this.willStart('games', 'games', rotowireLineups);
	}

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handleSearch = (query) => {
		this.setState({ searchQuery: query, currentPage: 1 });
	};

	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
	};

	handleLike = (player) => {
		const players = [ ...this.state.players ];
		const index = players.indexOf(player);

		players[index] = { ...players[index] };

		players[index].liked = !players[index].liked;
		this.setState({ players });
	};

	filterLiked = () => {
		this.state.filterLiked
			? this.setState({ filterLiked: false, currentPage: 1 })
			: this.setState({ filterLiked: true, currentPage: 1 });
	};

	renderLikeFilter = () => {
		let classes = 'fa fa-heart';
		if (!this.state.filterLiked) classes += '-o';
		return classes;
	};

	render() {
		const { pageSize, currentPage, searchQuery, sortColumn } = this.state;

		const { players, totalCount, filteredCount } = this.getPagedData();

		return (
			<div id="container">
				<SearchForm style={{ gridColumn: '1/10' }} value={searchQuery} onSearch={this.handleSearch} />
				<button onClick={() => this.filterLiked()} style={{ gridColumn: '10/13', margin: '10px' }}>
					Liked players <i style={{ color: 'red' }} className={this.renderLikeFilter()} aria-hidden="true" />
				</button>

				<div style={{ margin: 'auto' }}>
					<Pagination
						pageSize={pageSize}
						numberOfItems={totalCount}
						numberOfFilteredItems={filteredCount}
						currentPage={currentPage}
						onPageChange={this.handlePageChange}
					/>
				</div>

				<PlayersTable
					players={players}
					onLike={this.handleLike}
					sortColumn={sortColumn}
					onSort={this.handleSort}
				/>

				<LoadingSpinner isLoading={this.state.isLoading} />
			</div>
		);
	}
}

export default Players;
