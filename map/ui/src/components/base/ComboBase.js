import React from 'react';
import PropTypes from 'prop-types';
import InputBase from './InputBase';
import classHelper from './ClassHelper';
import domHelper from './DomHelper';

class ComboBase extends InputBase{
    constructor(props){
        super(props);
        this.scrollTop = 0;
        this.inputTimer = null;
        Object.assign(this.state, {
            panelClosed: true,
            panelLeft: 0,
            panelTop: 0
        });
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
    }
    componentDidMount(){
        super.componentDidMount();
        domHelper.bind(document, 'click', this.handleDocumentClick);
        domHelper.bind(document, 'mousewheel', this.handleMouseWheel);
    }
    componentWillUnmount(){
        super.componentWillUnmount();
        if (this.panelRef){
            this.el.appendChild(this.panelRef);
        }
        domHelper.unbind(document, 'click', this.handleDocumentClick);
        domHelper.unbind(document, 'mousewheel', this.handleMouseWheel);
    }
    handleDocumentClick(event){
        const {disabled,editable} = this.props;
        if (!disabled && !editable){
            if (domHelper.isChild(event.target, this.inputRef)){
                event.stopPropagation();
                this.togglePanel();
                return false;
            }
        }
        if (this.panelRef){
            event.stopPropagation();
            if (domHelper.isChild(event.target, this.el)){
                return false;
            }
            if (!domHelper.isChild(event.target, this.panelRef)){
                this.closePanel();
            }
        }
    }
    handleMouseWheel(event){
        if (this.panelRef){
            event.stopPropagation();
            if (domHelper.isChild(event.target, this.panelRef)){
                //return false;
            } else {
                this.closePanel();
            }
        }
    }
    togglePanel(){
        const {disabled,readOnly} = this.props;
        const {panelClosed} = this.state;
        if (disabled || readOnly){
            return;
        }
        panelClosed ? this.openPanel() : this.closePanel();
        this.focus();
    }
    alignPanel(){
        const {panelAlign} = this.props;
        let view = domHelper.getViewport();
        let pos = domHelper.offset(this.el);
        let hwidth = domHelper.outerWidth(this.el);
        let pwidth = domHelper.outerWidth(this.panelRef);
        let hheight = domHelper.outerHeight(this.el);	// host height
        let pheight = domHelper.outerHeight(this.panelRef);		// panel height
        let left = pos.left;
        if (panelAlign === 'right'){
            left += hwidth - pwidth;
        }
        if (left + pwidth > view.width + domHelper.getScrollLeft()){
            left = view.width + domHelper.getScrollLeft() - pwidth;
        }
        if (left < 0){
            left = 0;
        }
        let top = pos.top + hheight;
        if (top + pheight > view.height + domHelper.getScrollTop()){
            top = pos.top - pheight;
        }
        if (top < domHelper.getScrollTop()){
            top = pos.top + hheight;
        }
        this.setState({
            panelTop: top,
            panelLeft: left
        })
    }
    openPanel(){
        const {panelClosed} = this.state;
        const {panelStyle} = this.props;
        if (!panelClosed){
            return;
        }
        this.setState({panelClosed:false}, ()=>{
            document.body.appendChild(this.panelRef);
            let hwidth = domHelper.outerWidth(this.el);
            // let pwidth = domHelper.outerWidth(this.panelRef);
            // if (pwidth < hwidth || !panelStyle || !panelStyle['width']){
            //     this.panelRef.style.width = hwidth+'px';
            // }
            if (!panelStyle || !panelStyle['width']){
                this.panelRef.style.width = hwidth+'px';
            }
            this.alignPanel();
            this.panelRef.scrollTop = this.scrollTop;
        })
    }
    closePanel(){
        const {panelClosed} = this.state;
        if (!panelClosed){
            this.scrollTop = this.panelRef.scrollTop;
            this.el.appendChild(this.panelRef)
            this.setState({panelClosed:true})
        }
    }
    doFilter(text){
        this.setValue(text);
    }
    baseClasses(){
        return 'combo ' + super.baseClasses();
    }
    arrowClasses(){
        const {arrowAlign} = this.props;
        return classHelper.classNames(['textbox-addon f-column f-noshrink', {
            'f-order0':arrowAlign==='left',
            'f-order6':arrowAlign==='right'
        }]);
    }
    handleArrowClick(){
        this.togglePanel()
    }
    handleInputChange(event){
        let text = event.target.value
        this.setState({text:text});
        if (this.state.focused){
            if (this.state.panelClosed){
                this.openPanel();
            }
            clearTimeout(this.inputTimer);
            this.inputTimer = setTimeout(() => {
                this.doFilter(text);
            }, this.props.delay);
        }
    }
    renderArrow(){
        const {hasDownArrow,arrowIconCls} = this.props;
        if (!hasDownArrow){
            return null;
        }
        const iconCls = 'textbox-icon f-full ' + arrowIconCls;
        return (
            <span key="arrow" className={this.arrowClasses()} onClick={this.handleArrowClick.bind(this)}>
                <span className={iconCls}></span>
            </span>
        )
    }
    renderPanel(){
        const {panelStyle} = this.props;
        const {panelClosed,panelLeft,panelTop} = this.state;
        if (panelClosed){
            return null;
        }
        const style = Object.assign({}, panelStyle, {
            left: panelLeft+'px',
            top: panelTop+'px'
        })
        return (
            <div key="panel" className="panel-body panel-body-noheader combo-panel combo-p f-row" style={style} ref={el=>this.panelRef=el}>
            {this.renderContent()}
            </div>
        )
    }
    renderContent(){
        return null;
    }
    renderOthers(){
        return [this.renderArrow(),this.renderPanel()];
    }
}
ComboBase.propTypes = Object.assign({}, InputBase.propTypes, {
    hasDownArrow: PropTypes.bool,
    arrowIconCls: PropTypes.string,
    arrowAlign: PropTypes.string,
    panelAlign: PropTypes.string,
    panelStyle: PropTypes.object,
    multiple: PropTypes.bool,
    separator: PropTypes.string,
    delay: PropTypes.number
})
ComboBase.defaultProps = Object.assign({}, InputBase.defaultProps, {
    hasDownArrow: true,
    arrowIconCls: 'combo-arrow',
    arrowAlign: 'right',
    panelAlign: 'left',
    multiple: false,
    separator: ',',
    delay: 200
})
export default ComboBase


// WEBPACK FOOTER //
// ./src/components/base/ComboBase.js