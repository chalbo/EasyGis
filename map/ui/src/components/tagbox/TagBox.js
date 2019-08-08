import React from 'react';
import PropTypes from 'prop-types';
import domHelper from '../base/DomHelper';
import classHelper from '../base/ClassHelper';
import ComboBox from '../combobox/ComboBox';

class TagBox extends ComboBox{
    componentDidMount(){
        super.componentDidMount();
        this.autoSizeInput();
        domHelper.bind(this.el, 'click', this.handleClick.bind(this));
    }
    componentWillUnmount(){
        super.componentWillUnmount();
        domHelper.unbind(this.el, 'click', this.handleClick.bind(this));
    }
    handleClick(){
        setTimeout(() => this.focus())
    }
    clearText(){
        this.setState({text:''}, ()=>{
            this.autoSizeInput();
        })
    }
    blur(){
        super.blur();
        this.clearText();
    }
    fixValue() {
        // do nothing
        this.autoSizeInput();
    }
    updateText(forceUpdate){
        super.updateText(forceUpdate);
        this.clearText();
    }
    autoSizeInput() {
        if (!this.inputRef){
            return;
        }
        let el = this.inputRef;
        let style = getComputedStyle(el);
        let tmp = document.createElement('span');
        Object.assign(tmp.style, {
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            whiteSpace: 'nowrap'
        });
        tmp.innerHTML = this.state.text;
        document.body.appendChild(tmp);

        let getWidth = (val) => {
            val = val || '';
            var s = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tmp.innerHTML = s;
            return domHelper.outerWidth(tmp);
        };
        let width = this.state.text ? getWidth(this.state.text) : getWidth(this.props.placeholder);
        document.body.removeChild(tmp);
        this.inputRef.style.width = (width+20)+'px';
        if (!this.state.panelClosed){
            this.alignPanel();
        }
    }
    doEnter(){
        if (this.props.limitToList){
            this.doFilter('')
        } else {
            let value = [...this.state.value||[], this.state.text];
            this.setValue(value);
        }
        setTimeout(() => this.focus());
    }
    handleRemoveClick(index,event){
        event.stopPropagation();
        event.preventDefault();
        let value = this.state.value.filter((v,i)=>i!==index);
        setTimeout(() => this.setValue(value))
    }
    handleInputChange(event){
        let text = event.target.value
        this.setState({text:text}, ()=>{
            this.autoSizeInput()
        });
        if (this.state.focused){
            if (this.props.limitToList){
                this.openPanel();
                clearTimeout(this.inputTimer);
                this.inputTimer = setTimeout(() => {
                    this.doFilter(text);
                }, this.props.delay);
            }
        }
    }
    handleKeyDown(event){
        super.handleKeyDown(event);
        if (event.which === 13){
            this.doEnter();
        } else if (event.which === 27){
            this.clearText();
        }
    }
    getCss(css, row, type){
        if (css){
            let cssValue = typeof css === 'function' ? css(row) : css;
            if (type === 'class'){
                return typeof cssValue === 'string' ? cssValue : null;
            } else {
                return typeof cssValue === 'object' ? cssValue : null;
            }
        }
        return null;
    }
    getTagClass(row){
        return this.getCss(this.props.tagCss, row, 'class');
    }
    getTagStyle(row){
        return this.getCss(this.props.tagCss, row, 'style');
    }
    baseClasses(){
        return super.baseClasses()+' tagbox';
    }
    renderInput(){
        const input = super.renderInput();
        const labelCls = (row) => {
            return classHelper.classNames('tagbox-label f-order3 f-noshrink', this.getTagClass(row));
        }
        let selection = this.state.selection || [];
        return (
            <span className="tagbox-labels f-full f-order3">
            {
                selection.map((row,rowIndex) => (
                    <span key={rowIndex} className={labelCls(row)} style={this.getTagStyle(row)}>
                        {row[this.props.textField]}
                        <a href=" " className="tagbox-remove" onClick={(event)=>this.handleRemoveClick(rowIndex,event)}> </a>
                    </span>
                ))
            }
            {
                input
            }
            </span>
        )
    }
}
TagBox.propTypes = Object.assign({}, ComboBox.propTypes, {
    tagCss: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.object
    ])
})
TagBox.defaultProps = Object.assign({}, ComboBox.defaultProps, {
    hasDownArrow: false,
    multiple: true,
    limitToList: false
})
export default TagBox



// WEBPACK FOOTER //
// ./src/components/tagbox/TagBox.js