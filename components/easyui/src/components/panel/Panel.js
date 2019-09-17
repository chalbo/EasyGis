import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import SlideUpDown from '../base/SlideUpDown';
import LocaleBase from '../base/LocaleBase';

class Panel extends LocaleBase {
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
            closed: props.closed,
            animate: props.animate,
            collapseToShrinkBody: true
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.collapsed !== this.props.collapsed){
            nextProps.collapsed ? this.collapse() : this.expand()
        }
        if (nextProps.closed !== this.props.closed){
            this.setState({closed:nextProps.closed});
        }
        if (nextProps.animate !== this.props.animate){
            this.setState({animate:nextProps.animate});
        }
    }
    expand(){
        if (this.state.collapsed){
            this.setState({collapsed:false}, ()=>{
                this.props.onExpand();
            })
        }
    }
    collapse(){
        if (!this.state.collapsed){
            this.setState({collapsed:true}, ()=>{
                this.props.onCollapse();
            })
        }
    }
    toggle(){
        if (this.state.collapsed){
            this.expand();
        } else {
            this.collapse();
        }
    }
    hasHeader(){
        if (!this.props.showHeader){
            return false;
        }
        if (this.props.header || this.props.title){
            return true;
        } else {
            return false;
        }
    }
    hasFooter(){
        if (!this.props.showFooter){
            return false;
        }
        if (this.props.footer){
            return true;
        } else {
            return false;
        }
    }
    panelClasses(){
        return classHelper.classNames(['panel f-column', this.props.className]);
    }
    panelStyles(){
        return this.props.style;
    }
    headerClasses(){
        return classHelper.classNames(['panel-header f-noshrink',this.props.headerCls,
            {'panel-header-noborder':!this.props.border}
        ]);
    }
    bodyClasses(){
        return classHelper.classNames(['panel-body f-full', this.props.bodyCls, {
            'panel-body-noheader':!this.hasHeader(),
            'panel-body-nobottom':this.props.footer,
            'panel-body-noborder':!this.props.border
        }]);
    }
    footerClasses(){
        return classHelper.classNames(['panel-footer', this.props.footerCls, {
            'panel-footer-noborder':!this.props.border
        }]);
    }
    collapsibleClasses(){
        return this.state.collapsed?this.props.expandIconCls:this.props.collapseIconCls;
    }
    closableClasses(){
        return this.props.closeIconCls;
    }
    clickPanelHeader(){

    }
    clickCollapsibleTool(e){
        e.preventDefault();
        this.toggle();
    }
    clickCloseTool(e){
        e.preventDefault();
        this.setState({closed:true})
    }
    panelHeader(){
        if (!this.hasHeader()){
            return null;
        }
        const {header,iconCls,collapsible,closable} = this.props;
        const headerTitle = (
            <div className={classHelper.classNames('panel-title',{'panel-with-icon':iconCls})}>
                {this.props.title}
            </div>
        )
        const headerIcon = (
            <div className={classHelper.classNames('panel-icon',iconCls)}></div>
        )
        const panelTools = (
            <div className="panel-tool">
                {collapsible && <a href=" " className={this.collapsibleClasses()} onClick={this.clickCollapsibleTool.bind(this)}> </a>}
                {closable && <a href=" " className={this.closableClasses()} onClick={this.clickCloseTool.bind(this)}> </a>}
            </div>
        )
        return (
            <div className={this.headerClasses()} style={this.props.headerStyle} ref={el=>this.headerRef=el} onClick={this.clickPanelHeader.bind(this)}>
            {header ? header() : headerTitle}
            {iconCls && headerIcon}
            {(collapsible || closable) && panelTools}
            </div>
        )
    }
    panelFooter(){
        if (!this.hasFooter()){
            return null;
        }
        return (
            <div className={this.footerClasses()} style={this.props.footerStyle}>
                {this.props.footer()}
            </div>
        )
    }
    panelBody(){
        return (
            <div className={this.bodyClasses()} style={this.props.bodyStyle}>{this.props.children}</div>
        )
    }
    render() {
        if (this.state.closed){
            return null;
        }
        return (
            <div className={this.panelClasses()} style={this.panelStyles()} ref={el=>{this.panelRef=el;this.el=el}}>
                {this.panelHeader()}
                <SlideUpDown animate={this.state.animate} collapsed={this.state.collapsed} disabled={!this.state.collapseToShrinkBody}>
                    {this.panelBody()}
                </SlideUpDown>
                {this.panelFooter()}
            </div>
        )
    }
}
Panel.propTypes = {
    title: PropTypes.string,
    iconCls: PropTypes.string,
    border: PropTypes.bool,
    animate: PropTypes.bool,
    closed: PropTypes.bool,
    collapsed: PropTypes.bool,
    collapsible: PropTypes.bool,
    closable: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    expandIconCls: PropTypes.string,
    collapseIconCls: PropTypes.string,
    closeIconCls: PropTypes.string,
    headerCls: PropTypes.string,
    headerStyle: PropTypes.object,
    bodyCls: PropTypes.string,
    bodyStyle: PropTypes.object,
    footerCls: PropTypes.string,
    footerStyle: PropTypes.object,
    header: PropTypes.func,
    footer: PropTypes.func,
    onExpand: PropTypes.func,
    onCollapse: PropTypes.func
}
Panel.defaultProps = {
    border: true,
    animate: false,
    closed: false,
    collapsed: false,
    collapsible: false,
    closable: false,
    showHeader: true,
    showFooter: true,
    expandIconCls: 'panel-tool-expand',
    collapseIconCls: 'panel-tool-collapse',
    closeIconCls: 'panel-tool-close',
    onExpand(){},
    onCollapse(){}
}

export default Panel;


// WEBPACK FOOTER //
// ./src/components/panel/Panel.js