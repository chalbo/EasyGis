import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';

class Menu extends LocaleBase{
    constructor(props){
        super(props);
        this.timer = null;
        this.isDisplaying = false;
        this.state = {
            left: 0,
            top: 0,
            zIndex: Menu.zIndex++,
            closed: true
        }
    }
    componentDidMount(){
        if (!this.props.inline){
            document.body.appendChild(this.containerRef);
            domHelper.bind(document, 'click', this.handleDocumentClick.bind(this));
        }
    }
    componentWillUnmount(){
        if (!this.props.inline){
            this.el.appendChild(this.containerRef);
            domHelper.unbind(document, 'click', this.handleDocumentClick.bind(this));
        }
    }
    show(left, top) {
        this.setState({
            left: left,
            top: top,
            zIndex: Menu.zIndex++,
            closed: false
        }, ()=>{
            this.props.onShow();
        })
        clearTimeout(this.timer);
        this.isDisplaying = true;
        setTimeout(() => this.isDisplaying = false)
    }
    showAt(target, align = 'left') {
        this.show(0, 0);
        this.setState({}, ()=>this.alignTo(target, align))
    }
    showContextMenu(left, top){
        this.show(left, top);
        this.setState({}, ()=>this.alignContextMenu())
    }
    hide(){
        this.setState({closed:true}, ()=>{
            this.props.onHide();
        })
    }
    delayHide() {
        this.timer = setTimeout(() => {
            this.setState({closed:true}, ()=>{
                this.props.onHide();
            })
        }, this.props.duration);
    }
    alignTo(target, align = 'left'){
        let view = domHelper.getViewport();
        let pos = domHelper.offset(target);
        let targetWidth = domHelper.outerWidth(target);
        let targetHeight = domHelper.outerHeight(target);
        let menuWidth = domHelper.outerWidth(this.containerRef);
        let menuHeight = domHelper.outerHeight(this.containerRef);
        let left = align === 'left' ? pos.left : pos.left + targetWidth - menuWidth;
        let top = pos.top + targetHeight;
        if (left + menuWidth > view.width + domHelper.getScrollLeft()){
            left = pos.left + targetWidth - menuWidth;
        } else if (left < 0){
            left = pos.left;
        }
        if (top + menuHeight > view.height + domHelper.getScrollTop()){
            top = pos.top - menuHeight - 1;
        }
        if (top < domHelper.getScrollTop()){
            top = domHelper.getScrollTop() + 1;
        }
        this.setState({left:left,top:top})
    }
    alignContextMenu() {
        let {left,top} = this.state;
        let view = domHelper.getViewport();
        let width = domHelper.outerWidth(this.containerRef);
        let height = domHelper.outerHeight(this.containerRef);
        if (left + width > view.width + domHelper.getScrollLeft()){
            left -= width;
        }
        if (height > view.height + domHelper.getScrollTop()){
            top = domHelper.getScrollTop() + 1;
        } else {
            if (top + height > view.height + domHelper.getScrollTop()){
                top = view.height + domHelper.getScrollTop() - height - 1;
            }
        }
        this.setState({left:left,top:top})
    }
    handleDocumentClick(event){
        if (!this.state.closed){
            if (domHelper.isChild(event.target, this.containerRef)){
                return;
            }
            if (this.isDisplaying){
                return;
            }
            this.hide();
        }
    }
    handleMouseOver(){
        this.setState({closed:false})
        clearTimeout(this.timer);
    }
    handleMouseOut(){
        this.delayHide()
    }
    handleItemClick(value){
        this.props.onItemClick(value);
        this.hide();
    }
    containerClasses(){
        return classHelper.classNames(['menu-container f-inline-row', this.props.className, {
            'menu-noline': this.props.noline
        }]);
    }
    containerStyle(){
        const {left,top,zIndex,closed} = this.state;
        return Object.assign({
            width: domHelper.toStyleValue(this.props.menuWidth),
            left: left+'px',
            top: top+'px',
            zIndex: zIndex,
            display: this.props.inline ? null : (closed ? 'none' : 'block')
        }, this.props.style)
    }
    render(){
        const menuClasses = classHelper.classNames('menu f-column f-full', this.props.menuCls)
        return (
            <span className="menu-inline" ref={el=>this.el=el}>
                <div 
                    className={this.containerClasses()} 
                    style={this.containerStyle()} 
                    ref={el=>this.containerRef=el}
                    onMouseOver={this.handleMouseOver.bind(this)}
                    onMouseOut={this.handleMouseOut.bind(this)}
                >
                    <div className="menu-shadow"></div>
                    <div className={menuClasses} style={this.props.menuStyle}>
                    {
                        React.Children.map(this.props.children, (item) => (
                            React.cloneElement(item, {
                                closed: this.state.closed,
                                onItemClick: this.handleItemClick.bind(this)
                            })
                        ))
                    }
                    </div>
                    <div className="menu-line"></div>
                </div>
            </span>
        )
    }
}
Menu.zIndex = 110000;
Menu.propTypes = Object.assign({}, LocaleBase.propTypes, {
    menuWidth: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    menuCls: PropTypes.string,
    menuStyle: PropTypes.object,
    inline: PropTypes.bool,
    noline: PropTypes.bool,
    duration: PropTypes.number
})
Menu.defaultProps = {
    inline: false,
    noline: false,
    duration: 100,
    onShow(){},
    onHide(){},
    onItemClick(value){}
}
export default Menu


// WEBPACK FOOTER //
// ./src/components/menu/Menu.js