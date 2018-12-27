
import React from 'react'
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

class ColorField extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
        	displayColorPicker: false,
        	color: props.color
        }
    }
	
	componentWillReceiveProps(nextprops) {
		this.setState({
			color : nextprops.color
		})
	}

	handleClick = () => {
		if (!this.props.readOnly )
		this.setState({ displayColorPicker: !this.state.displayColorPicker })
	};
	
	handleClose = () => {
	    this.setState({ displayColorPicker: false })
	};

	handleChange = (color) => {
	  const {onValueChanged, field, index} = this.props
	  this.setState({ 
		  color: color.hex,
	      displayColorPicker: !this.state.displayColorPicker
	  })
	  onValueChanged(color.hex, field, index)
   }

  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '28px',
          height: '24px',
          borderRadius: '4px',
          background: this.state.color
        },
        swatch: {
          padding: '5px',
          background: (this.props.touched ? 'lightyellow' : '#fff'),
          borderRadius: '4px',
          boxShadow: '0 0 0 1px rgba(0,0,0,' + (this.props.readOnly ? '0' : '.1')+ ')',
          display: 'inline-block',
          cursor: (this.props.readOnly ? '' : 'pointer'),
        },
        popover: {
          position: 'relative',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div>
        <div style={ styles.swatch } onClick={ this.handleClick }>
          	<div style={ styles.color } />
        </div>
        { this.state.displayColorPicker ? 
        		<div style={ styles.popover }>
          			<div style={ styles.cover } 
          				onClick={ this.handleClose }
          			/>
          			<SketchPicker 
          				color={ this.state.color } 
          				onChange={ this.handleChange } 
          			/>
          		</div> 
          : null 
        }
      </div>
    )
  }
}

ColorField.defaultProps = {
		id: null,
		onValueChanged: null,
		color : 'red',
		readOnly : false,
		field: null,
		index: null,
		touched: false,
}

export default ColorField