import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class MyTeamForm extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		//const {onLogin} = props;

		this.state = {
			show: false,
			username: '',
			password: ''
		};
	}

	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	handleChange(event) {
		// console.log(event.target.value);
		if (event.target.id === 'formBasicEmail') {
			this.setState({ username: event.target.value });
		}
		if (event.target.id === 'formBasicPassword') {
			this.setState({ password: event.target.value });
		}
	}

	handleSubmit(event) {
		this.props.onLogin(this.state.username, this.state.password);
		event.preventDefault();
		this.handleClose();
	}

	render() {
		return (
			<React.Fragment>
				<Button
					variant="secondary"
					onClick={this.handleShow}
					style={{
						// backgroundColor: '#29163A',
						// borderColor: '#b185b5',
						height: '40px',
						width: '150px',
						margin: 'auto'
					}}
				>
					My team
				</Button>

				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title style={{ fontSize: '20px' }}>
							Sign in to PL Fantasy to retrive your team
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control type="email" placeholder="Enter email" onChange={this.handleChange} />
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control type="password" placeholder="Password" onChange={this.handleChange} />
							</Form.Group>
							<Button
								variant="secondary"
								style={{ float: 'right', margin: '0px 5px 0px 5px' }}
								onClick={this.handleClose}
							>
								Close
							</Button>
							<Button
								variant="primary"
								style={{
									backgroundColor: '#29163A',
									borderColor: '#b185b5',
									float: 'right',
									margin: '0px 5px 0px 5px'
								}}
								type="submit"
								onClick={this.handleSubmit}
							>
								Submit
							</Button>
						</Form>
					</Modal.Body>
					<Modal.Footer />
				</Modal>
			</React.Fragment>
		);
	}
}

export default MyTeamForm;