import React    from "react";
import Transmit from "react-transmit";  // Import Transmit.
import _ from "underscore";

import Config    from "./Config.js";
import Movie    from "./Movie.js";

import {Carousel,CarouselItem,Button} from 'react-bootstrap';
import LangSelector from './LangSelector.js';
import SearchInput from './SearchInput.js';

require('es6-promise').polyfill();
require('isomorphic-fetch');


const MovieSelect = React.createClass({
	getInitialState(){
		return {
			selectedItems:this.props.selectedItems || []
		}
	},
	clearSelected(){
		this.setState({selectedItems:[]});
		if (this.props.valueLink !== undefined) this.props.valueLink.requestChange([]);
	},
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
	searchChange(newValue){
		this.props.setQueryParams({
			searchText: newValue
		});
	},
	componentDidMount(){
		this.props.setQueryParams({
			searchText:this.props.searchText,
			apiKey: this.props.apiKey,
			count:this.props.maxCount || 5
		});
	},
	selectItem(item){
		var items = this.state.selectedItems;
		var index = items.indexOf(item);
		if (index === -1) {
			items.push(item);
		}
		else{
			items.splice(index,1);
		}
		
		if (this.props.valueLink !== undefined) {
			let config = this.props.queryParams.config;
			var selectedMovies = _.map(this.state.selectedItems,function(movie){
				var clone = _.clone(movie)
				clone.poster_path = config.images.base_url + config.images.poster_sizes[2] + clone.poster_path;
				//if (clone.media_type==="tv") clone.title = clone.name; 
				return {movie:clone};
			})
			
			this.props.valueLink.requestChange(selectedMovies);
		}
		this.setState({selectedItems:items});
	},
	render() {
		// Transmit props are guaranteed.
		let movies = this.props.movies;
		let config = this.props.queryParams.config;

		let movieCarousel = config!==undefined?<span>There are no movies, tvs.</span>:<span>{this.props.queryParams.status_message}</span>;
		var selectedItems = this.state.selectedItems;
		if (movies !== undefined && movies.length !== 0) {
			movieCarousel =
				<Carousel>
					{movies.map(function (movie, index) {
						var selected = selectedItems.indexOf(movie) !== -1
						return (<CarouselItem>
							<Movie movie={movie} selected={selected} onSelect={this.selectItem} config={config} />
						</CarouselItem>);
					}, this)}
				</Carousel>
		}
		var clearButtonStyle ={}
		if (this.state.selectedItems.length === 0) clearButtonStyle = {display:'none'};
		return (
			<div>
				<div className="row">
					<div className="col-md-6">
						<SearchInput onChange={this.searchChange} />
					</div>
					<div className="col-md-2">
						<Button bsStyle='primary' style={clearButtonStyle} onClick={this.clearSelected}>Clear <span className="badge">{this.state.selectedItems.length}</span></Button>
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
export default Transmit.createContainer(MovieSelect, {
	queryParams: {
		apiKey:'',
		searchText:'',
		count: 5,  // Default query params.
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
				var url = "https://api.themoviedb.org/3/search/multi";
				return fetch(url + '?api_key=' + queryParams.apiKey + '&language=' + 	queryParams.lang + '&query='+ queryParams.searchText + '&page=1').then(function(resp) {
					return resp.json().then(function(movies) {
						return Promise.all(
							_.map(_.filter(movies.results,function(item){return item.media_type === "movie" || item.media_type === "tv"}).slice(0,queryParams.count), function (movie) {
								return Movie.getQuery("movie", {
									apiKey: queryParams.apiKey,
									lang:queryParams.lang,
									movieId: movie.id,
									mediaType:movie.media_type
								})
							})
						)
					})
				})
			},function(reason){ return []}));
		}
	}
});

