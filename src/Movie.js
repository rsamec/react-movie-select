import React    from "react";
import Transmit from "react-transmit"; 
import {Button} from 'react-bootstrap';

const DEFAULT_IMAGE = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjE5MC4zMTI1IiB5PSIyNTAiIHN0eWxlPSJmaWxsOiNBQUFBQUE7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LWZhbWlseTpBcmlhbCwgSGVsdmV0aWNhLCBPcGVuIFNhbnMsIHNhbnMtc2VyaWYsIG1vbm9zcGFjZTtmb250LXNpemU6MjNwdDtkb21pbmFudC1iYXNlbGluZTpjZW50cmFsIj41MDB4NTAwPC90ZXh0PjwvZz48L3N2Zz4=";
const Movie = React.createClass({
	handleClick(selectedItem) {
		if (this.props.onSelect !== undefined) this.props.onSelect(selectedItem);
	},
	render() {
		// Passed down props.
		let item = this.props.movie;
		let config = this.props.config;
		var title = item.title || item.name;

		var poster_path = !!item.poster_path?config.images.base_url + config.images.poster_sizes[4] + item.poster_path:DEFAULT_IMAGE;
		return (
			<div>
				<img className="img-responsive" alt={item.title} src={poster_path}/>
				<div className='carousel-caption'>
					<h3>{item.title}</h3>
					<p>{item.overview}</p>
					<Button bsStyle='primary' onClick={this.handleClick.bind(this, item)}>{this.props.selected ? 'Remove' : 'Add'}</Button>
				</div>
			</div>);
	}
});

export default Transmit.createContainer(Movie, {
	queries: {
		// This "story" query returns a Fetch API promise.
		movie(queryParams) {
			if (queryParams.mediaType ==="movie")
				return fetch("https://api.themoviedb.org/3/movie/" + queryParams.movieId + "?api_key=" + queryParams.apiKey +  '&language=' + 	queryParams.lang).then(resp => resp.json());
			else if (queryParams.mediaType ==="tv"){
				return fetch("https://api.themoviedb.org/3/tv/" + queryParams.movieId + "?api_key=" + queryParams.apiKey +  '&language=' + 	queryParams.lang).then(resp => resp.json());
			}
			else {
				return undefined;
			}
		}
	}
});
