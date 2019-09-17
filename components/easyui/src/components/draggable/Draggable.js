import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import DraggableClass from './DraggableClass';
import { DraggableProxy } from '.';

class Draggable extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            proxyClosed: true
        }
    }
    componentDidMount(){
        while(!(this.el instanceof Element)){
            this.el = this.el.el;
        }
        this._dragInstance = new DraggableClass(this, this.props);
        this._dragInstance.bindEvents();
    }
    componentWillUnmount(){
        this._dragInstance.unbindEvents();
    }
    componentWillReceiveProps(nextProps){
        this._dragInstance.updateOptions(nextProps);
    }
    showProxy(){
        if (!this.props.proxy){
            return false;
        }
        this.setState({proxyClosed:false}, ()=>{
            this._dragInstance.proxyObj = this.proxyObj;
        });
        return true;
    }
    hideProxy(){
        this.setState({proxyClosed:true}, ()=>{
            this._dragInstance.proxyObj = null;
        })
    }
    renderProxy(){
        if (this.state.proxyClosed){
            return null;
        }
        return (
            <DraggableProxy 
                key="proxy" 
                ref={ref=>this.proxyObj=ref}
                host={this} 
                className={this.props.proxyCls}
                style={this.props.proxyStyle}
            >
                {this.props.proxy()}
            </DraggableProxy>
        )
    }
    render(){
        return [
            React.cloneElement(React.Children.only(this.props.children), {
                ref: ref=>this.el=ref,
                key: 'main'
            }),
            this.renderProxy()
        ]
    }
}
Draggable.propTypes = {
    scope: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]),
    handle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.object
    ]),
    disabled: PropTypes.bool,
    revert: PropTypes.bool,
    deltaX: PropTypes.number,
    deltaY: PropTypes.number,
    edge: PropTypes.number,
    delay: PropTypes.number,
    axis: PropTypes.string, // v or h
    cursor: PropTypes.string,
    proxy: PropTypes.func,
    proxyCls: PropTypes.string,
    proxyStyle: PropTypes.object,
    onDragStart: PropTypes.func,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func
}
Draggable.defaultProps = {
    disabled: false,
    revert: false,
    edge: 0,
    delay: 100,
    cursor: 'move',
    onDragStart(e){},
    onDrag(e){},
    onDragEnd(e){}
}
export default Draggable


// WEBPACK FOOTER //
// ./src/components/draggable/Draggable.js