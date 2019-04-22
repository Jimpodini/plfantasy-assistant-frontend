import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { Component } from 'react';
import http from '../services/httpService';
import Pagination from './common/pagination';
import { paginate } from '../utils/paginate';
import SearchForm from './common/searchForm';
import { teams } from '../services/extractTeamService';
import PlayersTable from './playersTable';
import _ from 'lodash';
import LoadingSpinner from './common/loadingSpinner';
import Dropdown from 'react-bootstrap/Dropdown';
import { toast } from 'react-toastify';
import MyTeamForm from './myTeamForm';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://fantasy.premierleague.com/drf/elements/';
const apiTeamsUrl = 'https://fantasy.premierleague.com/drf/teams/';
const rp = require('request-promise');
const url = 'https://www.rotowire.com/soccer/lineups.php';

class Players extends Component {
	constructor(props) {
		super(props);

		this.handleTeamFilter = this.handleTeamFilter.bind(this);
	}
	state = {
		players: [],
		fixtures: [],
		fiveNextGameweeks: [],
		pageSize: 40,
		currentPage: 1,
		searchQuery: '',
		sortColumn: { path: 'full_name', order: 'asc' },
		filterLiked: false,
		isLoading: true,
		filter: 'All players',
		teamFilter: [],
		teamFilterToggled: false,
		isLoggedIn: false,
		error: false
	};

	async populateOdds() {
		try {
			http.post('/odds');
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
		const {
			pageSize,
			currentPage,
			players: allPlayers,
			searchQuery,
			filterLiked,
			filter,
			teamFilter,
			teamFilterToggled
		} = this.state;

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

		if (filter !== 'All players') {
			filtered = filtered.filter((player) => player.position === filter);
		}

		if (teamFilterToggled) {
			filtered = filtered.filter((player) => teamFilter.includes(player.id));
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
			const fixturesPromise = http.get(proxyUrl + 'https://fantasy.premierleague.com/drf/fixtures/');
			const latestUpdatePromise = http.get('/updates');
			//const oddsPromise = this.getOdds();

			let [ players, rotowireLineups, fantasyScoutLineups, fixtures, latestUpdate ] = await Promise.all([
				playersPromise,
				rotowireLineupsPromise,
				fantasyScoutLineupsPromise,
				fixturesPromise,
				latestUpdatePromise
			]);

			fixtures = fixtures.data;
			let fiveNextGameweeks = [];

			//console.log(fixtures);
			const fixturesUpcoming = fixtures.filter(
				(fixture) => fixture.started === false && fixture.event_day != null
			);

			for (let i = 0; i < fixturesUpcoming.length; i++) {
				const teamFixture = fixturesUpcoming[i];

				const gameWeek = teamFixture.deadline_time_formatted;
				if (!fiveNextGameweeks.includes(gameWeek) && fiveNextGameweeks.length < 5) {
					fiveNextGameweeks = [ ...fiveNextGameweeks, gameWeek ];
				}
			}

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

			const odds = await http.get('/odds');

			players = players.data;
			// players.map((player) => this.setPlayerAttributes(player, rotowireLineups, fantasyScoutLineups, odds));
			players.map((player) =>
				this.setPlayerAttributes(
					player,
					rotowireLineups,
					fantasyScoutLineups,
					odds,
					fiveNextGameweeks,
					fixtures
				)
			);

			this.setState({ players, fixtures, fiveNextGameweeks, isLoading: false });
		} catch (err) {
			console.log(err.message);
			console.log(err);
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

	setFiveNextGameweeks = (player, fiveNextGameweeks, fixtures) => {
		// const fixtures = this.state.fixtures.filter(
		// 	(fixture) => fixture.started === false && fixture.event_day != null
		// );

		//let formattedFixtures = [];

		const teamID = player.team;

		let teamNextFiveGames = [];
		let i = 1;

		let doubleGameweek = false;
		let missingGameweek = false;

		fiveNextGameweeks.forEach((gw) => {
			const game = fixtures.filter(
				(fixture) =>
					fixture.deadline_time_formatted === gw && (fixture.team_a === teamID || fixture.team_h === teamID)
			);

			if (game.length === 0) {
				missingGameweek = true;
				teamNextFiveGames = [
					...teamNextFiveGames,
					{ gameWeekNr: 'GW' + i, opponent: 'No game', difficulty: 10, missingGameweek, doubleGameweek }
				];
			} else {
				if (game.length > 1) doubleGameweek = true;
				//const opponentID = game[0].team_h === 1 ? game[0].team_a : game[0].team_h;
				game.forEach((g) => {
					let opponentID;
					let difficultyLevel;

					if (g.team_h === teamID) {
						opponentID = g.team_a;
						difficultyLevel = g.team_h_difficulty;
					} else {
						opponentID = g.team_h;
						difficultyLevel = g.team_a_difficulty;
					}

					teamNextFiveGames = [
						...teamNextFiveGames,
						{
							gameWeekNr: 'GW' + i,
							opponent: teams[opponentID - 1].oddsName,
							difficulty: difficultyLevel,
							missingGameweek,
							doubleGameweek
						}
					];
				});
			}

			i++;
		});

		if (teamNextFiveGames.length > 0) {
			let sum = 0;
			let count = 0;
			let gamesInfo = '';

			teamNextFiveGames.forEach((game) => {
				sum += game.difficulty;
				count += 1;
				gamesInfo += '(' + game.gameWeekNr + ') ' + game.opponent + ' - ' + game.difficulty + '\n';
			});

			const averageDifficulty = (sum / count).toFixed(1);

			let styling = { borderRadius: '50%', border: 'solid black 1px', padding: '3px' };
			if (doubleGameweek && missingGameweek) {
				styling.backgroundColor = '#ffdfba';
			} else if (doubleGameweek) {
				styling.backgroundColor = '#baffc9';
			} else if (missingGameweek) {
				styling.backgroundColor = '#ffb3ba';
			}

			// const averageDifficulty =
			// 	teamNextFiveGames.reduce((total, number) => total + number) / teamNextFiveGames.length;
			//console.log(gamesInfo);
			player['avg_difficulty'] = averageDifficulty;
			player['double_gameweek'] = doubleGameweek;
			player['styling'] = styling;
			player['games_info'] = gamesInfo;
		}
	};

	async setPlayerAttributes(player, rotowireLineups, fantasyScoutLineups, odds, fiveNextGameweeks, fixtures) {
		try {
			player['full_name'] = player.first_name + ' ' + player.second_name;

			if (player['full_name'] === 'Fernando Luiz Rosa') {
				player['first_name'] = 'Fernandinho';
				player['last_name'] = 'Fernandinho';
				player['full_name'] = 'Fernandinho';
			}

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
				default:
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
			this.setFiveNextGameweeks(player, fiveNextGameweeks, fixtures);

			const teamNameRotowire = teams[player.team - 1].rotowireName;
			player['will_start_rotowire'] = this.willStart(
				teamNameRotowire,
				player.second_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ')[0],
				rotowireLineups
			);

			player['will_start_fantasy_scout'] = this.willStart(
				teamNameOddsAPI,
				`<span class="player-name">${player.second_name}</span>`,
				fantasyScoutLineups
			);
			if (player['will_start_fantasy_scout'] === 'No') {
				player['will_start_fantasy_scout'] = this.willStart(
					teamNameOddsAPI,
					`<span class="player-name">${player.first_name.split(' ')[0]}`,
					fantasyScoutLineups
				);
			}

			player['now_cost'] = player['now_cost'] / 10;
		} catch (err) {
			if (!this.state.error) {
				toast.warn('Unknown error, refresh the page');
				this.setState({ error: true });
			}
		}

		//player['will_start'] = this.willStart('games', 'games', rotowireLineups);
	}

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handleFilter = (filter) => {
		this.setState({ filter });
	};

	handleLogout = () => {
		this.setState({ isLoggedIn: false, teamFilter: [] });
	};

	async handleTeamFilter(username, password) {
		try {
			const myTeam = await http.get('/myteam', { params: { username: username, password: password } });

			toast.success('Successfully logged in. Click "My team" to toggle filter on/off');

			this.setState({ teamFilter: myTeam.data.playerIds, isLoggedIn: true, teamFilterToggled: true });
		} catch (err) {
			console.log(err);
			toast.error('Bad credentials. Coult not retrieve team');
		}
	}

	toggleTeamFilter = () => {
		this.setState({ teamFilterToggled: !this.state.teamFilterToggled });
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
		const { pageSize, currentPage, searchQuery, sortColumn, isLoggedIn, teamFilterToggled } = this.state;

		const { players, totalCount, filteredCount } = this.getPagedData();

		return (
			<Container>
				{this.state.isLoading ? (
					<div style={{ textAlign: 'center' }}>
						<div style={{ display: 'inline-block' }}>
							<LoadingSpinner isLoading={this.state.isLoading} />
						</div>
					</div>
				) : (
					<React.Fragment>
						<Row>
							<Col xs="12" lg="4">
								<SearchForm value={searchQuery} onSearch={this.handleSearch} />
							</Col>

							<Col xs="12" lg="2" className="navbarButton">
								<MyTeamForm
									toggleTeamFilter={this.toggleTeamFilter}
									teamFilterToggled={teamFilterToggled}
									onLogout={this.handleLogout}
									loggedIn={isLoggedIn}
									onLogin={this.handleTeamFilter}
								/>
							</Col>
							<Col xs="12" lg="3">
								<Dropdown>
									<Dropdown.Toggle
										variant="secondary"
										id="dropdown-basic"
										className="navbarDropdown"
										block
									>
										{this.state.filter}
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item onClick={() => this.handleFilter('All players')}>
											All players
										</Dropdown.Item>
										<Dropdown.Item onClick={() => this.handleFilter('GK')}>
											Goalkeepers
										</Dropdown.Item>
										<Dropdown.Item onClick={() => this.handleFilter('DEF')}>
											Defenders
										</Dropdown.Item>
										<Dropdown.Item onClick={() => this.handleFilter('MID')}>
											Midfielders
										</Dropdown.Item>
										<Dropdown.Item onClick={() => this.handleFilter('FWD')}>Forwards</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown>
							</Col>
							<Col xs="12" lg="3" className="navbarButton">
								<Button className="mt-2 mb-2" variant="light" onClick={() => this.filterLiked()} block>
									Liked players{' '}
									<i
										style={{ color: 'red' }}
										className={this.renderLikeFilter()}
										aria-hidden="true"
									/>
								</Button>
							</Col>
						</Row>

						<Row>
							<Col xs="12">
								<div style={{ textAlign: 'center' }}>
									<div className="d-none d-sm-inline-block">
										<Pagination
											pageSize={pageSize}
											numberOfItems={totalCount}
											numberOfFilteredItems={filteredCount}
											currentPage={currentPage}
											onPageChange={this.handlePageChange}
										/>
									</div>
								</div>
								<div
									className="btn-group btn-block mb-3 d-sm-none"
									role="group"
									aria-label="Basic example"
								>
									<button type="button" className="btn btn-secondary">
										<i className="fas fa-angle-double-left" />
									</button>
									<button type="button" className="btn btn-secondary">
										<i className="fas fa-angle-double-right" />
									</button>
								</div>
							</Col>
						</Row>

						<PlayersTable
							players={players}
							onLike={this.handleLike}
							sortColumn={sortColumn}
							onSort={this.handleSort}
						/>
					</React.Fragment>
				)}
			</Container>
		);
	}
}

export default Players;
