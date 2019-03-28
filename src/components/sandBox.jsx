import React, { Component } from 'react';
import axios from 'axios';
import { teams } from '../services/extractTeamService';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

// get average difficult level over next 5 games
// display hover div with next five games when hovering over the number
// style averge numbers depending if there is a double week or not within the next five games

class SandBox extends Component {
	render() {
		return (
			<div style={{ position: 'relative', height: '100%', border: '1px solid black' }}>
				<div
					style={{
						display: 'grid',
						margin: 'auto',
						width: '100px',
						height: '100px',
						backgroundColor: 'blue'
					}}
				/>
			</div>
		);
	}
}

export default SandBox;
