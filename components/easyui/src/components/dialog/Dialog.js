import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import Panel from '../panel/Panel';
import { Draggable } from '../draggable';
import { Resizable } from '../resizable';

class Dialog extends Panel{
    constructor(props){
        super(props);
        this.maskEl = null;
        Object.assign(this.state, {
            left: null,
            top: null,
            width: null,
            height: null
        })
    }
    componentDidMount(){
        this.initDialog();
    }
    componentWillUnmount(){
        this.closeMask();
        if (this.panelRef){
            this.dialogContainer.appendChild(this.panelRef);
        }
    }
    componentWillReceiveProps(nextProps){
        super.componentWillReceiveProps(nextProps);
        if (nextProps.closed !== this.props.closed){
            if (nextProps.closed){
                this.close();
            } else {
                this.open();
            }
        }
    }
    initDialog() {
        if (this.draggableObj){
            this.panelRef = this.draggableObj.el;
        } else if (this.resizableObj){
            this.panelRef = this.resizableObj.el;
        }
        if (!this.state.closed){
            if (this.panelRef){
                document.body.appendChild(this.panelRef);
                this.openMask();
                this.displaying();
            }
        } else {
            this.closeMask();
        }
    }
    openMask() {
        if (this.props.modal && !this.maskEl){
            this.maskEl = document.createElement('div');
            domHelper.addClass(this.maskEl, 'window-mask');
            document.body.appendChild(this.maskEl);
        }
    }
    closeMask() {
        if (this.maskEl){
            document.body.removeChild(this.maskEl);
            this.maskEl = null;
        }
    }
    open(){
        if (this.state.closed){
            this.setState({closed:false}, ()=>{
                this.initDialog();
                this.props.onOpen();
            })
        }
    }
    close(){
        if (!this.state.closed){
            this.dialogContainer.appendChild(this.panelRef);
            this.closeMask();
            this.setState({closed:true}, ()=>{
                this.props.onClose();
            })
        }
    }
    displaying() {
        this.moveToTop();
        this.left = parseInt(this.panelRef.style.left,10)||null;
        this.top = parseInt(this.panelRef.style.top,10)||null;
        if (this.props.autoCenter){
            if (this.left == null){
                this.hcenter();
            }
            if (this.top == null){
                this.vcenter();
            }
        }
    }
    moveToTop() {
        if (this.maskEl){
            this.maskEl.style.zIndex = String(Dialog.zIndex++);
        }
        if (this.panelRef){
            this.panelRef.style.zIndex = String(Dialog.zIndex++);
        }
    }
    hcenter() {
        if (this.panelRef){
            let view = domHelper.getViewport();
            let width = domHelper.outerWidth(this.panelRef);
            this.setState({left:(view.width - width) / 2})
        }
    }
    vcenter() {
        if (this.panelRef){
            let view = domHelper.getViewport();
            let height = domHelper.outerHeight(this.panelRef);
            let scrollTop = domHelper.getScrollTop();
            this.setState({top:(view.height - height) / 2 + scrollTop})
        }
    }
    center() {
        this.hcenter();
        this.vcenter();
    }
    panelClasses(){
        const {borderType} = this.props;
        let cls = 'window window-shadow';
        if (borderType === 'none'){
            cls += ' window-thinborder window-noborder';
        } else if (borderType === 'thin'){
            cls += ' window-thinborder';
        }        
        return classHelper.classNames('panel f-column', cls, this.props.className);
    }
    panelStyles(){
        const {style} = this.props;
        const {left,top,width,height} = this.state;
        return Object.assign({}, style||{}, {
            left: left?left+'px':(style?style.left:null),
            top: top?top+'px':(style?style.top:null),
            width: width?width+'px':(style?style.width:null),
            height: height?height+'px':(style?style.height:null)
        });
    }
    headerClasses(){
        return super.headerClasses() + ' window-header';
    }
    bodyClasses(){
        let cls = 'window-body';
        if (!this.hasHeader()){
            cls += ' window-body-noheader';
        }
        return super.bodyClasses() + ' ' + cls;
    }
    footerClasses(){
        return super.footerClasses() + ' window-footer';
    }
    clickCloseTool(e){
        e.preventDefault();
        this.close();
    }
    handleDragEnd(event){
        const value = {left:event.left,top:event.top};
        this.setState(value, ()=>{
            this.props.onMove(value)
        })
    }
    handleResizeStop(event){
        const value = {left:event.left,top:event.top,width:event.width,height:event.height};
        this.setState(value, ()=>{
            this.props.onResize(value)
        })
    }
    render() {
        const {resizable,draggable} = this.props;
        let panel = super.render();
        if (panel){
            if (draggable){
                panel = (
                    <Draggable
                        edge={5}
                        handle={this.headerRef}
                        ref={ref=>this.draggableObj=ref}
                        onDragEnd={this.handleDragEnd.bind(this)}
                    >
                    {panel}
                    </Draggable>
                )
            }
            if (resizable){
                panel = (
                    <Resizable
                        edge={5}
                        ref={ref=>this.resizableObj=ref}
                        onResizeStop={this.handleResizeStop.bind(this)}
                    >
                        {panel}
                    </Resizable>
                )
            }
        }
        return (
            <div className="dialog-inline" ref={el=>this.dialogContainer=el}>
            {panel}
            </div>
        )
    }
}
Dialog.zIndex = 9000;
Dialog.propTypes = Object.assign({}, Panel.propTypes, {
    title: PropTypes.string,
    border: PropTypes.bool,
    borderType: PropTypes.string,
    closable: PropTypes.bool,
    modal: PropTypes.bool,
    autoCenter: PropTypes.bool,
    draggable: PropTypes.bool,
    resizable: PropTypes.bool
})
Dialog.defaultProps = Object.assign({}, Panel.defaultProps, {
    border: false,
    borderType: 'thick',
    closable: true,
    modal: false,
    autoCenter: true,
    draggable: false,
    resizable: false,
    onOpen(){},
    onClose(){},
    onMove({left,top}){},
    onResize({width,height}){}
})
export default Dialog;



// WEBPACK FOOTER //
// ./src/components/dialog/Dialog.js