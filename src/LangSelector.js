import React from 'react';
import Select from 'react-select';
import isoLang from './isoLang';

export default class LangSelector extends React.Component {
	constructor(props)
	{
		super(props)
		this.state = {lang:props.defaultLang || 'en'};
		
	}
	handleChange(newValue){
		this.setState({lang:newValue});
		if (this.props.onChange !== undefined) this.props.onChange(newValue);
	}
	
	render(){
		return (<Select
			name="form-field-name"
			value={this.state.lang}
			options={isoLang}
			onChange={this.handleChange.bind(this)}
		/>)
	}
}
