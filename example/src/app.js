import React from 'react';
import MovieSelect from 'react-movie-select';
import BindToMixin from 'react-binding';

var App = React.createClass({
	mixins:[BindToMixin],
	getInitialState(){
		return { data:{}};
	},
	render () {
		
		var selectedItems = this.state.data.selectedItems || [];
		return (
			<div>
				<MovieSelect apiKey="aa3f9011bd8f4021846099cb988f034a" valueLink={this.bindToState('data','selectedItems')} />
				<ul>
				{selectedItems.map(function(item,index){
					return (<li>{item.title}</li>)
				})}
				</ul>
			</div>
		);
	}
});

React.render(<App />, document.getElementById('app'));
