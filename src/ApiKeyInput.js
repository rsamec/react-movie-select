import React from 'react';

export default
class ApiKeyInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = {apiKey: props.defaultApiKey || ''};

	}

	handleChange(newValue) {
		this.setState({apiKey: newValue});

	}

	sendClick(e) {
		if (this.props.onChange !== undefined) this.props.onChange(this.state.apiKey);
	}

	render() {
		var valueLink = {
			value: this.state.apiKey,
			requestChange: this.handleChange.bind(this)
		};
		return (
			<div className="input-group">
				<input type="text" className="form-control" placeholder="Api key for..." valueLink={valueLink}/>
				<span className="input-group-btn">
					<button className="btn btn-default" type="button" onClick={this.sendClick.bind(this)}>Go!</button>
				</span>
			</div>);
	}
}
