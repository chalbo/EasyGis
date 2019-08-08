import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';

class ButtonGroup extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            selectedButton: null
        }
    }
    render(){
        let buttons = this.props.children;
        if (this.props.selectionMode === 'single'){
            buttons = React.Children.map(this.props.children, button => {
                return React.cloneElement(button, {
                    selected: button === this.state.selectedButton,
                    onClick: ()=>{
                        this.setState({selectedButton:button});
                        button.props.onClick();
                    }
                })
            })
        }
        return (
            <span className="button-group f-inline-row" style={this.props.style}>
                {
                    buttons
                }
            </span>
        )
    }
}
ButtonGroup.propTypes = {
    selectionMode: PropTypes.oneOf(['single','multiple'])
}
ButtonGroup.defaultProps = {
    selectionMode: 'multiple'
}
export default ButtonGroup


// WEBPACK FOOTER //
// ./src/components/linkbutton/ButtonGroup.js