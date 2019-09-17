import React from 'react';
import MenuButton from '../menubutton/MenuButton';

class SplitButton extends MenuButton{
    constructor(props){
        super(props);
        this.clickToShowMenu = false;
    }
    handleLineClick(event){
        event.stopPropagation();
        if (!this.props.disabled){
            this.showMenu();
        }
    }
    innerCls(){
        const {size,plain} = this.props;
        let cls = super.innerCls();
        cls += ' s-btn s-btn-' + size;
        if (this.state.isActived){
            cls += plain ? ' s-btn-plain-active' : ' s-btn-active';
        }
        return cls;
    }
    renderInners(){
        return [
            <span key="text" className={this.btnTextCls()}>{this.text()}</span>,
            <span key="icon" className={this.btnIconCls()}></span>,
            <span key="arrow" className="m-btn-downarrow"></span>,
            <span key="line" 
                className="m-btn-line"
                onClick={this.handleLineClick.bind(this)}
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}
            />,
            this.renderMenu()
        ]
    }
    render(){
        return this.renderButton();
    }
}
export default SplitButton


// WEBPACK FOOTER //
// ./src/components/splitbutton/SplitButton.js