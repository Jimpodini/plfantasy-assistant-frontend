import React, { Component } from 'react';

class MyTeam extends Component {
	state = { teamID: 'test' };
	render() {
		return <h1>{this.state.teamID}</h1>;
	}
}

export default MyTeam;
