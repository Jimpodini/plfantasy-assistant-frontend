import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../pictures/Premier_League_Logo.svg.png';

const NavBar = () => {
	return (
		<React.Fragment>
			<div className="navbar" style={{ backgroundColor: '#29163A' }}>
				<Container>
					<div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
						<img src={logo} className="d-inline-block align-top" alt="" />
					</div>
				</Container>
			</div>
		</React.Fragment>
	);
};

export default NavBar;
