import React from 'react';
import {Carousel,CarouselItem,Button, Input} from 'react-bootstrap';
import _ from 'underscore';

export default class CarouselSelect extends React.Component {
	handleClick(selectedItem) {
		var items = this.props.items;
		var index = items.indexOf(selectedItem);
		if (index !== -1) {

			var cloneItem = _.clone(items[index])
			//toggle select
			cloneItem.selected = !cloneItem.selected;
			items = items.set(index,cloneItem);
		};

		if (this.props.onSelect !== undefined) this.props.onSelect(_.filter(items,function(item){return item.selected;}))
	}
	render() {
		return (<Carousel  defaultActiveIndex={2}>
					{this.props.items.map(function (item, index) {
						var imgSrc = item.imgSrc || "data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
						return (<CarouselItem>
							<img alt={item.title} src={imgSrc}/>
							<div className='carousel-caption'>
								<h3>{item.title}</h3>
								<p>{item.overview}</p>
								<Button bsStyle='primary' onClick={this.handleClick.bind(this, item)}>{item.selected ? 'Remove' : 'Add'}</Button>
							</div>
						</CarouselItem>);
					}, this)}
		</Carousel>)
	}
};
