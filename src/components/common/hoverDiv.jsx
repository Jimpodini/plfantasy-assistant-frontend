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
			backgroundColor: '#F2F1F1',
			border: '1px solid black',
			fontWeight: 'normal',
			position: 'absolute',
			fontSize: '12px',
			borderRadius: '10px',
			padding: '5px',
			whiteSpace: 'pre-wrap'
		};

		return (
			<div>
				<div onMouseOver={this.handleMouseHover} onMouseOut={this.handleMouseHover}>
					<a style={this.props.style}>{this.props.text}</a>
				</div>
				{this.state.isHovering && (
					<div style={styles} className="hoverDiv">
						{this.props.hoverText}
					</div>
				)}
			</div>
		);
	}
}

export default HoverDiv;
