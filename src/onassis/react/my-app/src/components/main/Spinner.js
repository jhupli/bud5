import React from 'react' // ← Main React library

class Spinner extends React.Component{
	constructor(props) {
	    super(props);
	}
	
	render(){
		//console.log("fetch:"+this.props.fetching)
		return(this.props.fetching ? '...' : '')					
		
	}
}

export default Spinner
