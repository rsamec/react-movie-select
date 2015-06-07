import React    from "react";
import Transmit from "react-transmit"; 
import {Button} from 'react-bootstrap';

const Movie = React.createClass({
	handleClick(selectedItem) {
	},
	render() {
		// Passed down props.
		let item = this.props.movie;
		let config = this.props.config;
		var poster_path = config.images.base_url + config.images.poster_sizes[4] + item.poster_path;
		return (
			<div>
				<img alt={item.title} src={poster_path}/>
				<div className='carousel-caption'>
					<h3>{item.title}</h3>
					<p>{item.overview}</p>
					<Button bsStyle='primary' onClick={this.handleClick.bind(this, item)}>{item.selected ? 'Remove' : 'Add'}</Button>
				</div>
			</div>);
	}
});

export default Transmit.createContainer(Movie, {
	queries: {
		// This "story" query returns a Fetch API promise.
		movie(queryParams) {
			return fetch("https://api.themoviedb.org/3/movie/" + queryParams.movieId + "?api_key=" + queryParams.apiKey +  '&language=' + 	queryParams.lang).then(resp => resp.json());
		}
	}
});
