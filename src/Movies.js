import React    from "react";
import Transmit from "react-transmit";  // Import Transmit.
import _ from "underscore";

import Config    from "./Config.js";
import Movie    from "./Movie.js";

import CarouselSelect from "./CarouselSelect.js"
import {Carousel,CarouselItem} from 'react-bootstrap';
import LangSelector from './LangSelector.js';
import ApiKeyInput from './ApiKeyInput.js';

require('es6-promise').polyfill();
require('isomorphic-fetch');


const Movies = React.createClass({
	langChange(newValue){
		this.props.setQueryParams({
			lang: newValue
		})	
	},
	apiKeyChange(newValue) {
		this.props.setQueryParams({
			apiKey: newValue
		});
	},
	
	render() {
		// Transmit props are guaranteed.
		let movies = this.props.movies; 
		let config = this.props.queryParams.config;

		let movieCarousel = <span>{this.props.queryParams.status_message}</span>;
		if (movies !== undefined && movies.length !== 0) {
			movieCarousel =
				<Carousel>
					{movies.map(function (movie, index) {
						return (<CarouselItem>
							<Movie movie={movie} config={config} />
						</CarouselItem>);
					}, this)}
				</Carousel>
		}

		return (
			<div>
				<div className="row">
					<div className="col-md-8">
						<ApiKeyInput onChange={this.apiKeyChange} />
					</div>
					<div className="col-md-4">
						<LangSelector onChange={this.langChange} />
					</div>
				</div>
				{movieCarousel}
			</div>); 
	}
});

// Higher-order component that will do queries for the above React component.
export default Transmit.createContainer(Movies, {
	queryParams: {
		apiKey: '',
		count: 10,  // Default query params.
		lang:'en'
	},
	queries: {
		// Query names become the Transmit prop names. 
		movies(queryParams) {
			 
			 // This "stories" query returns a Promise composed of 3 other Promises.
			 return (Config.getQuery("config", {apiKey: queryParams.apiKey}).then(function(resp){
				 if (!!resp.status_code){
					 queryParams.status_message = resp.status_message; 
					 return []; 
				 } 
				 queryParams.status_message = undefined;
				 queryParams.config = resp;
			return fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=' + queryParams.apiKey + '&language=' + 	queryParams.lang).then(function(resp) {
					return resp.json().then(function(movies) {
						return Promise.all(_.map(movies.results.slice(0,3), function (movie) {
								return Movie.getQuery("movie", {
									apiKey: queryParams.apiKey,
									lang:queryParams.lang,
									movieId: movie.id
								});
							})
						)
					})
				})
			},function(reason){ return []}));
		}
	}
});

