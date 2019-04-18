import React, { Component } from 'react';
import axios from 'axios';
import http from '../services/httpService';
import { teams } from '../services/extractTeamService';
import queryString from 'query-string';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const rp = require('request-promise');

// get average difficult level over next 5 games
// display hover div with next five games when hovering over the number
// style averge numbers depending if there is a double week or not within the next five games

class SandBox extends Component {
	// getTeam = () => {
	// 	// return http.get(
	// 	// 	proxyUrl + 'http://www.fplstatistics.co.uk/Home/AjaxPricesFHandler?iselRow=157&pyseltype=0&_=1555227477338'
	// 	// );
	// 	return rp(proxyUrl + 'http://www.fplstatistics.co.uk/Home/IndexWG?gridPriceData_inside=1');
	// };

	async componentDidMount() {
		//const data = await this.getTeam();
		// const parsed = data.match(/<td class="text-align-center">(.*?)td>/);
		// console.log(parsed);
		// var regex = /<td class="text-align-center">(.*?)<\/td>/g;
		// var matches = [];
		// var match = regex.exec(data);
		// while (match != null) {
		// 	matches.push(match[1]);
		// 	match = regex.exec(data);
		// }
		// var regex2 = /<div style="text-align: center">(.*?)<\/div>/g;
		// var matches2 = [];
		// var match2 = regex2.exec(data);
		// while (match2 != null) {
		// 	matches2.push(match2[1]);
		// 	match2 = regex2.exec(data);
		// }
		// console.log(matches);
		// console.log(matches2);
		// let final = {};
		// for (let i = 0; i < matches.length; i = i++) {
		// 	final = { ...final, name: matches[i + 8], prob: matches2[i] };
		// }
		// console.log(final);
		// matches[32] = matches[32].replace(/&#252;/g, 'u');
		// console.log(matches[32]);
		// const team = data.data.aaData[20][11];
		// //console.log(team);
		// this.setState({ team });
	}

	render() {
		return (
			<div className="container">
				<div className="row">
					<div className="col-6 col-lg-12" style={{ backgroundColor: 'blue' }}>
						Hej
					</div>
					<div className="col-6" style={{ backgroundColor: 'yellow' }}>
						Hej
					</div>
				</div>
			</div>
		);
	}
}

export default SandBox;
