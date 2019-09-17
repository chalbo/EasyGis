import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import treeHelper from '../base/TreeHelper';
import LocaleBase from '../base/LocaleBase';
import SideMenuItems from './SideMenuItems';
import SideMenuTip from './SideMenuTip';

class SideMenu extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            selection: null
        }
    }
    componentWillMount(){
        this.setData();
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.data !== this.props.data){
            this.setData(nextProps.data);
        }
    }
    setData(data){
        if (!data){
            data = this.props.data;
        }
        treeHelper.forNodes(data, (node) => {
            if (!node.iconCls){
                node.iconCls = 'sidemenu-default-icon';
            }
            if (node.children){
                node.nodeCls = 'tree-node-nonleaf';
                if (!node.state){
                    node.state = 'closed';
                }
                if (node.state === 'open'){
                    node.nodeCls = 'tree-node-nonleaf';
                } else {
                    node.nodeCls = 'tree-node-nonleaf tree-node-nonleaf-collapsed';
                }
            }
        });
    }
    handleNodeClick(node){
        if (node.children){
            node.state = node.state==='closed' ? 'open' : 'closed';
            if (node.state === 'open'){
                node.nodeCls = 'tree-node-nonleaf';
            } else {
                node.nodeCls = 'tree-node-nonleaf tree-node-nonleaf-collapsed';
            }
        } else {
            this.itemClick.emit(node);
            this.tipContents.forEach(tc => tc.hide());
        }
    }
    handleSelectionChange(selection){
        this.setState({selection:selection});
        this.props.onSelectionChange(selection);
    }
    handleItemClick(item){
        this.props.onItemClick(item);
    }
    renderCollapsed(){
        const {collapsed,border,collapsedCls} = this.props;
        const accCls = classHelper.classNames('accordion', collapsedCls, {
            'accordion-noborder': !border
        })
        if (!collapsed){
            return null;
        }
        return (
            <div className="sidemenu sidemenu-collapsed f-full">
                <div className={accCls}>
                {
                    this.props.data.map((menu,index) => (
                        <SideMenuTip 
                            key={index} 
                            {...this.props} 
                            {...this.state} 
                            menu={menu}
                            onSelectionChange={this.handleSelectionChange.bind(this)}
                            onItemClick={this.handleItemClick.bind(this)}
                        />
                    ))
                }
                </div>
            </div>
        )
    }
    renderItems(){
        const {collapsed} = this.props;
        if (collapsed){
            return null;
        }
        return (
            <SideMenuItems 
                {...this.props} 
                {...this.state} 
                onSelectionChange={this.handleSelectionChange.bind(this)}
                onItemClick={this.handleItemClick.bind(this)}
            />
        )
    }
    render(){
        const cls = classHelper.classNames('f-column', this.props.className)
        return (
            <div className={cls} style={this.props.style}>
                {this.renderCollapsed()}
                {this.renderItems()}
            </div>
        )
    }
}
SideMenu.propTypes = Object.assign({}, LocaleBase.propTypes, {
    data: PropTypes.array,
    collapsed: PropTypes.bool,
    border: PropTypes.bool,
    animate: PropTypes.bool,
    multiple: PropTypes.bool,
    showCollapsedText: PropTypes.bool,
    floatMenuWidth: PropTypes.number,
    floatMenuPosition: PropTypes.string,
    collapsedCls: PropTypes.string
})
SideMenu.defaultProps = {
    collapsed: false,
    border: true,
    animate: true,
    multiple: true,
    showCollapsedText: false,
    floatMenuWidth: 200,
    floatMenuPosition: 'right',
    onSelectionChange(selection){},
    onItemClick(item){}
}
export default SideMenu


// WEBPACK FOOTER //
// ./src/components/sidemenu/SideMenu.js