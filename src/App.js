import React, { Component } from 'react';
import Players from './components/players';
import NavBar from './components/navBar';
import { Route } from 'react-router-dom';
import './App.css';

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<NavBar />
				<main className="container">
					<Route path="/" component={Players} />
				</main>
			</React.Fragment>
		);
	}
}

export default App;
