import React from 'react' // ← Main React library
import Content from './Content'
import MenuBar from '../navi/MenuBar'
import Ping from '../ping/ping'

class Onassis extends React.Component{
    render(){
	    return (
	    	<div>
	    	 <Ping />
	    	 <MenuBar />
	    	 <Content /> 
			 {/*
				<FooterInstance />
			*/}
		</div>
	    )
    }
}

export default Onassis