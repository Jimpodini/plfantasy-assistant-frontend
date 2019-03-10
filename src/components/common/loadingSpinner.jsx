import React from 'react';

import { BounceLoader } from 'react-spinners';

const style = { display: 'block', margin: '0 auto' };

class LoadingSpinner extends React.Component {
	render() {
		return (
			<div style={style} className="sweet-loading">
				<BounceLoader sizeUnit={'px'} size={150} color={'purple'} loading={this.props.isLoading} />
			</div>
		);
	}
}

export default LoadingSpinner;
