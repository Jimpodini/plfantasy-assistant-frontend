import React from 'react';
import { Link } from 'react-router-dom';
import logo from '/Users/ellencecilia/Documents/plfantasy/src/pictures/Premier_League_Logo.svg.png';

const NavBar = () => {
	return (
		<nav className="navbar navbar-expand-lg" style={{ position: 'relative', backgroundColor: '#29163A' }}>
			<Link className="navbar-brand" to="/" style={{ color: 'white', fontWeight: 'bold' }}>
				<img src={logo} className="d-inline-block align-top" alt="" />
			</Link>
			<p
				style={{
					position: 'absolute',
					left: '85%',
					top: '70%',
					fontWeight: 'bold',
					float: 'right',
					color: 'white'
				}}
			>
				Fantasy Assistant
			</p>
		</nav>
	);
};

export default NavBar;
