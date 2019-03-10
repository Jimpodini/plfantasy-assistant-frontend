import React, { Component } from 'react';
import Players from './components/players';
import NavBar from './components/navBar';
import { Route, Redirect, Switch } from 'react-router-dom';
import './App.css';
import SandBox from './components/sandBox';

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<NavBar />

				<main className="container">
					<Switch>
						<Route path="/sandbox" component={SandBox} />
						<Route path="/players" component={Players} />
						<Redirect from="/" exact to="/players" />
					</Switch>
				</main>
			</React.Fragment>
		);
	}
}

export default App;
