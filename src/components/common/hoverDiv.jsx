import React, { Component } from 'react';

class HoverDiv extends Component {
	constructor(props) {
		super(props);
		this.handleMouseHover = this.handleMouseHover.bind(this);
		this.state = {
			isHovering: false
		};
	}

	handleMouseHover() {
		this.setState(this.toggleHoverState);
	}

	toggleHoverState(state) {
		return {
			isHovering: !state.isHovering
		};
	}

	render() {
		let styles = {
			backgroundColor: 'gray',
			border: '1px solid black',
			fontWeight: 'normal',
			position: 'absolute',
			fontSize: '12px',
			borderRadius: '10px',
			padding: '5px'
		};

		return (
			<div>
				<div onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover}>
					{this.props.text}
				</div>
				{this.state.isHovering && <div style={styles}>{this.props.hoverText}</div>}
			</div>
		);
	}
}

export default HoverDiv;
