import React from 'react' // ← Main React library
var FontAwesome = require('react-fontawesome');

class Spinner extends React.Component{
	constructor(props) {
	    super(props);
	}

	render(){
		var spin = <FontAwesome name='spinner' spin />
		//console.log("fetch:"+this.props.fetching)
		return(this.props.fetching ? spin : '')					
		
	}
}

export default Spinner
