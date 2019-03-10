import React, { Component } from 'react';
import axios from 'axios';
import { teams } from '../services/extractTeamService';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// get average difficult level over next 5 games
// display hover div with next five games when hovering over the number
// style averge numbers depending if there is a double week or not within the next five games

class SandBox extends Component {
	state = {
		fixtures: []
	};

	getFixtures = () => {
		return axios.get('https://fantasy.premierleague.com/drf/fixtures/');
	};

	async componentDidMount() {
		const fixtures = await this.getFixtures();
		this.setState({ fixtures: fixtures.data });
	}

	render() {
		// Get all the games that are scheduled but that haven't started
		const fixtures = this.state.fixtures.filter(
			(fixture) => fixture.started === false && fixture.event_day != null
		);

		let formattedFixtures = [];
		let fiveNextGameweeks = [];

		for (let i = 0; i < fixtures.length; i++) {
			const teamFixture = fixtures[i];

			const gameWeek = teamFixture.deadline_time_formatted;
			if (!fiveNextGameweeks.includes(gameWeek) && fiveNextGameweeks.length < 5) {
				fiveNextGameweeks = [ ...fiveNextGameweeks, gameWeek ];
			}
		}

		let teamNextFiveGames = [];
		let i = 1;

		let doubleGameweek = false;
		let missingGameweek = false;

		fiveNextGameweeks.forEach((gw) => {
			const game = fixtures.filter(
				(fixture) => fixture.deadline_time_formatted === gw && (fixture.team_a === 1 || fixture.team_h === 1)
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

					if (g.team_h === 1) {
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

		console.log(formattedFixtures);
		// .data.filter((fixture) => fixture.started == false && fixture.event_day != null)
		// .orderBy((fixture) => fixture.id);
		console.log(fiveNextGameweeks);

		console.log(teamNextFiveGames);

		return <h1>Hej</h1>;
	}
}

export default SandBox;
