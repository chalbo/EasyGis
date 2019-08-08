import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import domHelper from '../base/DomHelper';
import TooltipContent from './TooltipContent';

class Tooltip extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            closed: true,
            trackMouseX: 0,
            trackMouseY: 0,
            target: null
        }
        this.handleActive = this.handleActive.bind(this);
        this.handleDeactive = this.handleDeactive.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }
    componentDidMount(){
        const {showEvent,hideEvent} = this.props;
        while(!(this.el instanceof Element)){
            this.el = this.el.el;
        }
        this.setState({target:this.el}, ()=>{
            this.bindEvents(showEvent,hideEvent);
            domHelper.bind(this.state.target, 'mousemove', this.handleMouseMove);
            domHelper.bind(document, 'click', this.handleDocumentClick);
        });
    }
    componentWillUnmount(){
        this.bindEvents('','');
        domHelper.unbind(this.state.target, 'mousemove', this.handleMouseMove);
        domHelper.unbind(document, 'click', this.handleDocumentClick);
    }
    bindEvents(showEvent='',hideEvent=''){
        const el = this.state.target;
        const bind = (key, eventName, handler) => {
            if (el[key]){
                if (el[key] !== eventName){
                    el[key].split(' ').forEach(event => {
                        domHelper.unbind(el, event, handler);
                    });
                    el[key] = eventName;
                    el[key].split(' ').forEach(event => {
                        domHelper.bind(el, event, handler);
                    });
                }
            } else {
                el[key] = eventName;
                el[key].split(' ').forEach(event => {
                    domHelper.bind(el, event, handler);
                });
            }
        }
        bind('_showEvent', showEvent, this.handleActive);
        bind('_hideEvent', hideEvent, this.handleDeactive);
    }
    clearTimeouts() {
        clearTimeout(this.showTimer);
        clearTimeout(this.hideTimer);
    }
    show(){
        const {showDelay} = this.props;
        this.clearTimeouts();
        this.showTimer = setTimeout(() => {
            this.setState({closed:false})
        }, showDelay)
    }
    hide(){
        const {hideDelay} = this.props;
        this.clearTimeouts();
        this.hideTimer = setTimeout(() => {
            this.setState({closed:true})
        }, hideDelay)
    }
    handleDocumentClick(e){
        const {closed} = this.state;
        if (closed || !this.tip){
            return;
        }
        if (!domHelper.isChild(e.target, this.tip.tooltipRef) && !domHelper.isChild(e.target, this.state.target)){
            this.hide();
        }
    }
    handleMouseMove(e){
        if (this.props.trackMouse){
            this.setState({
                trackMouseX: e.pageX,
                trackMouseY: e.pageY
            })
        }
    }
    handleActive(e){
        this.setState({
            trackMouseX: e.pageX,
            trackMouseY: e.pageY
        }, ()=>{
            this.show();
        })
    }
    handleDeactive(){
        this.hide();
    }
    handleContentMouseEnter(){
        setTimeout(() => this.show())
    }
    handleContentMouseLeave(){
        this.hide();
    }
    renderTip(){
        if (this.state.closed || this.props.disabled || !this.props.content){
            return null;
        }
        return (
            <TooltipContent 
                key="k2" 
                ref={ref=>this.tip=ref}
                {...this.props} 
                {...this.state}
                onContentMouseEnter={this.handleContentMouseEnter.bind(this)}
                onContentMouseLeave={this.handleContentMouseLeave.bind(this)}
                onPosition={event => this.props.onPosition(event)}
            />
        )
    }
    render(){
        return [
            React.cloneElement(React.Children.only(this.props.children), {
                ref:ref=>this.el=ref,
                key:'k1'
            }),
            this.renderTip()
        ]
    }
}
Tooltip.propTypes = Object.assign({}, LocaleBase.propTypes, {
    target: PropTypes.element,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func
    ]),
    disabled: PropTypes.bool,
    tooltipCls: PropTypes.string,
    tooltipStyle: PropTypes.object,
    zIndex: PropTypes.number,
    position: PropTypes.string,
    trackMouse: PropTypes.bool,
    tracking: PropTypes.bool,
    deltaX: PropTypes.number,
    deltaY: PropTypes.number,
    valign: PropTypes.string,
    showDelay: PropTypes.number,
    hideDelay: PropTypes.number,
    showEvent: PropTypes.string,
    hideEvent: PropTypes.string,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onPosition: PropTypes.func
})
Tooltip.defaultProps = Object.assign({}, LocaleBase.defaultProps, {
    disabled: false,
    zIndex: 11000000,
    position: 'bottom',
    trackMouse: false,
    tracking: false,
    deltaX: 0,
    deltaY: 0,
    valign: 'middle',
    showDelay: 200,
    hideDelay: 200,
    showEvent: 'mouseenter touchstart',
    hideEvent: 'mouseleave',
    onShow(){},
    onHide(){},
    onPosition({left,top}){}
})
export default Tooltip


// WEBPACK FOOTER //
// ./src/components/tooltip/Tooltip.js