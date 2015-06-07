import React from 'react';

export default class SearchInput extends React.Component {
	constructor(props) {
		super(props)
		this.state = {searchText: ''};
	}

	handleChange(newValue) {
		this.setState({searchText: newValue});
	}

	sendClick(e) {
		if (this.props.onChange !== undefined) this.props.onChange(this.state.searchText);
	}

	render() {
		var valueLink = {
			value: this.state.searchText,
			requestChange: this.handleChange.bind(this)
		};
		return (
			<div className="input-group">
				<input type="text" className="form-control" placeholder="Search for a movie, tv show, person..." valueLink={valueLink}/>
				<span className="input-group-btn">
					<button className="btn btn-default" type="button" onClick={this.sendClick.bind(this)}>Go!</button>
				</span>
			</div>);
	}
}
