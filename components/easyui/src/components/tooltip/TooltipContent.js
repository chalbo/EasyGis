import React from 'react';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';

class TooltipContent extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            left: 0,
            top: 0
        }
    }
    componentDidMount(){
        document.body.appendChild(this.tooltipRef);
        this.setPosition();
        this.tracking();
    }
    componentWillUnmount(){
        this.untracking();
        this.el.appendChild(this.tooltipRef);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.trackMouseX !== this.props.trackMouseX){
            this.reposition();
        }
        if (nextProps.trackMouseY !== this.props.trackMouseY){
            this.reposition();
        }
        if (nextProps.content !== this.props.content){
            setTimeout(() => this.setPosition())
        }
    }
    tracking(){
        if (this.props.tracking){
            this.timer = setInterval(() => {
                this.setPosition();
            }, 200);
        }
    }
    untracking(){
        clearInterval(this.timer);
    }
    setPosition(){
        const {target} = this.props;
        if (!this.tooltipRef){
            return;
        }
        this.tooltipRef.style.display = 'block';
        this.targetWidth = domHelper.outerWidth(target);
        this.targetHeight = domHelper.outerHeight(target);
        this.tipWidth = domHelper.outerWidth(this.tooltipRef);
        this.tipHeight = domHelper.outerHeight(this.tooltipRef);
        this.reposition();
    }
    reposition() {
        let view = domHelper.getViewport();
        let pos = this.getPosition(this.props.position);
        if (this.position === 'top' && pos.top < domHelper.getScrollTop()){
            pos = this.getPosition('bottom');
        } else if (this.position === 'bottom'){
            if (pos.top + this.tipHeight > view.height + domHelper.getScrollTop()){
                pos = this.getPosition('top');
            }
        }
        if (pos.left < domHelper.getScrollLeft()){
            if (this.position === 'left'){
                pos = this.getPosition('right');
            } else {
                let arrowLeft = this.tipWidth / 2 + pos.left - domHelper.getScrollLeft();
                this.arrowOuterRef.style.left = arrowLeft + 'px';
                this.arrowInnerRef.style.left = arrowLeft + 'px';
                pos.left = domHelper.getScrollLeft();
            }
        } else if (pos.left + this.tipWidth > view.width + domHelper.getScrollLeft()){
            if (this.position === 'right'){
                pos = this.getPosition('left');
            } else {
                let arrowLeft = pos.left;
                pos.left = view.width + domHelper.getScrollLeft() - this.tipWidth;
                arrowLeft = this.tipWidth / 2 - (pos.left - arrowLeft);
                this.arrowOuterRef.style.left = arrowLeft + 'px';
                this.arrowInnerRef.style.left = arrowLeft + 'px';
            }
        }
        this.setState({left:pos.left,top:pos.top}, ()=>{
            this.props.onPosition({left:pos.left,top:pos.top});
        })
        let bc = 'border-' + this.position + '-color';
        let borderColor = this.tooltipRef.style.borderColor;
        let backColor = this.tooltipRef.style.backgroundColor;
        this.arrowOuterRef.style[bc] = borderColor;
        this.arrowInnerRef.style[bc] = backColor;
    }
    getPosition(pos = 'bottom') {
        const {target,valign,trackMouse,trackMouseX,trackMouseY,deltaX,deltaY} = this.props;
        this.position = pos || 'bottom';
        let left = 0;
        let top = 0;
        let offset = domHelper.offset(target);
        let targetWidth = this.targetWidth;
        let targetHeight = this.targetHeight;
        let tipWidth = this.tipWidth;
        let tipHeight = this.tipHeight;
        if (trackMouse){
            left = trackMouseX + deltaX;
            top = trackMouseY + deltaY;
            targetWidth = targetHeight = 0;
        } else {
            left = offset.left + deltaX;
            top = offset.top + deltaY;
        }
        switch(this.position){
            case 'right':
                left += targetWidth + 12 + (trackMouse ? 12 : 0);
                if (valign === 'middle'){
                    top -= (tipHeight - targetHeight) / 2;
                }
                break;
            case 'left':
                left -= tipWidth + 12 + (trackMouse ? 12 : 0);
                if (valign === 'middle'){
                    top -= (tipHeight - targetHeight) / 2;
                }
                break;
            case 'top':
                left -= (tipWidth - targetWidth) / 2;
                top -= tipHeight + 12 + (trackMouse ? 12 : 0);
                break;
            case 'bottom':
                left -= (tipWidth - targetWidth) / 2;
                top += targetHeight + 12 + (trackMouse ? 12 : 0);
                break;
            default:
                //...
        }
        return {
            left: left,
            top: top
        };
    }

    tooltipClasses(){
        const {tooltipCls} = this.props;
        return classHelper.classNames(['tooltip', 'tooltip-'+this.position, tooltipCls]);
    }
    tooltipStyles(){
        const {tooltipStyle,zIndex} = this.props;
        const {left,top} = this.state;
        return Object.assign({}, tooltipStyle||{}, {
            left: left+'px',
            top: top+'px',
            zIndex: zIndex
        });
    }
    handleMouseEnter(){
        this.props.onContentMouseEnter();
    }
    handleMouseLeave(){
        this.props.onContentMouseLeave();
    }
    renderContent(){
        const {content} = this.props;
        if (typeof content === 'function'){
            return content();
        } else {
            return content;
        }
    }
    render(){
        return (
            <div ref={el=>this.el=el} className="f-hide">
                <div tabIndex="-1" 
                    ref={el=>this.tooltipRef=el}
                    className={this.tooltipClasses()}
                    style={this.tooltipStyles()}
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                >
                    <div className="tooltip-content">
                    {this.renderContent()}
                    </div>
                    <div ref={el=>this.arrowOuterRef=el} className="tooltip-arrow-outer"></div>
                    <div ref={el=>this.arrowInnerRef=el} className="tooltip-arrow"></div>
                </div>
            </div>
        )
    }
}
TooltipContent.defaultProps = Object.assign({}, LocaleBase.defaultProps, {
    onContentMouseEnter(){},
    onContentMouseLeave(){},
    onPosition({left,top}){}
})
export default TooltipContent


// WEBPACK FOOTER //
// ./src/components/tooltip/TooltipContent.js