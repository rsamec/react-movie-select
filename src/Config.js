import React    from "react";
import Transmit from "react-transmit";  // Import Transmit.

const Config = React.createClass({
	render () {
		const config = this.props.config; // Passed down props.

		return (<pre>{JSON.stringify(config)}</pre>);
	}
});

export default Transmit.createContainer(Config, {
	queries: {
		// This "story" query returns a Fetch API promise.
		config (queryParams) {
			return fetch("https://api.themoviedb.org/3/configuration?api_key=" + queryParams.apiKey).then(resp => resp.json());
		}
	}
});
