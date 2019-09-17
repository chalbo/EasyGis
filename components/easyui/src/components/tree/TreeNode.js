import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import SlideUpDown from '../base/SlideUpDown';
import TreeNodeEditor from './TreeNodeEditor';
import TreeNodeTitle from './TreeNodeTitle';

class TreeNode extends LocaleBase{
    constructor(props){
        super(props);
        this.loading = false;
    }
    componentDidMount(){
        this.props.node.parent = this.props.pnode;
    }
    nodeClasses(){
        const {node,highlightNode} = this.props;
        return classHelper.classNames('tree-node',[node.nodeCls, {
            'tree-node-hover': node===highlightNode,
            'tree-node-selected': this.isSelected(),
            'tree-node-disabled': node.disabled
        }]);
    }
    hitClasses(){
        return classHelper.classNames(['tree-hit', {
            'tree-expanded': this.isExpanded(),
            'tree-collapsed': this.isCollapsed()
        }]);
    }
    iconClasses(){
        return classHelper.classNames(['tree-icon tree-folder', this.props.node.iconCls, {
            'tree-folder-open': this.isExpanded(),
            'tree-file': this.isLeaf(),
            'tree-loading': this.loading
        }]);
    }
    checkboxClasses() {
        let cc = ['unchecked','checked','indeterminate'];
        let index = cc.indexOf(this.props.node.checkState);
        if (index === -1){
            index = 0;
        }
        return 'tree-checkbox tree-checkbox' + index;
    }
    isExpanded() {
        const {node} = this.props;
        if (!node.state || node.state === 'open'){
            return true;
        } else {
            return false;
        }
    }
    isCollapsed() {
        const {node} = this.props;
        if (node.state && node.state === 'closed'){
            return true;
        } else {
            return false;
        }
    }
    isSelected() {
        return this.props.node === this.props.selection;
    }
    isLeaf() {
        const {node} = this.props;
        if (node.state === 'closed'){
            return false;
        } else {
            if (node.children && node.children.length){
                this.loading = false;
                return false;
            } else {
                if (this.loading){
                    return false;
                }
                return true;
            }
        }
    }
    indentWidth() {
        const {depth} = this.props;
        if (this.isLeaf()){
            return (depth+1) * 16;
        } else {
            return depth * 16;
        }
    }
    doEdit(node, el){
        this.props.tree.beginEdit(node, el);
    }
    handleMouseEnter(){
        const {node} = this.props;
        if (!node.disabled){
            this.props.tree.setState({highlightNode:node})
        }
    }
    handleMouseLeave(){
        this.props.tree.setState({highlightNode:null})
    }
    handleNodeClick(event){
        const {node,tree,clickToEdit,dblclickToEdit} = this.props;
        if (node.disabled){
            return;
        }
        tree.props.onNodeClick(node);
        tree.selectNode(node);

        if (clickToEdit || (dblclickToEdit && tree.state.editingItem)){
            this.doEdit(node, event.target);
        }
    }
    handleNodeDblClick(event){
        const {node,tree,dblclickToEdit} = this.props;
        tree.props.onNodeDblClick(node);
        if (dblclickToEdit){
            this.doEdit(node, event.target);
        }
    }
    handleHitClick(event){
        const {node,tree} = this.props;
        event.stopPropagation();
        if (this.isExpanded()){
            tree.collapseNode(node);
        } else {
            this.loading = true;
            tree.expandNode(node);
        }
    }
    handleCheckClick(event){
        const {node} = this.props;
        event.stopPropagation();
        if (node.checkState === 'checked'){
            this.props.tree.uncheckNode(node);
        } else {
            this.props.tree.checkNode(node);
        }
    }
    handleNodeContextMenu(event){
        const {node,tree} = this.props;
        tree.props.onNodeContextMenu({node:node,originalEvent:event})
    }
    renderChildren(node){
        const {depth,animate} = this.props;
        const children = node.children;
        if (!children || !children.length){
            return null;
        }
        return (
            <SlideUpDown animate={animate} collapsed={node.state==='closed'}>
                <ul>
                {
                    children.map((cnode,index) => {
                        return <TreeNode {...this.props} key={index} node={cnode} pnode={node} depth={depth+1}></TreeNode>
                    })
                }
                </ul>

            </SlideUpDown>
        )
    }
    renderTitle(){
        const {node,tree,editor,editRules} = this.props;
        if (tree.isEditing(node)){
            return (
                <TreeNodeEditor node={node} editor={editor} editRules={editRules} tree={tree}></TreeNodeEditor>
            )
        } else {
            return (
                <TreeNodeTitle node={node} tree={tree}></TreeNodeTitle>
            )
        }
    }
    render(){
        const {node,checkbox} = this.props;
        if (node.hidden){
            return null;
        }
        return (
            <li>
                <div className={this.nodeClasses()}
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                    onClick={this.handleNodeClick.bind(this)}
                    onDoubleClick={this.handleNodeDblClick.bind(this)}
                    onContextMenu={event=>this.handleNodeContextMenu(event)}
                >
                    <span className="tree-indent" style={{width:this.indentWidth()}}></span>
                    {!this.isLeaf() && <span className={this.hitClasses()} onClick={event=>this.handleHitClick(event)}></span>}
                    <span className={this.iconClasses()}></span>
                    {checkbox && <span className={this.checkboxClasses()} onClick={event=>this.handleCheckClick(event)}></span>}
                    {this.renderTitle()}
                </div>
                {this.renderChildren(node)}
            </li>
        )
    }
}
TreeNode.propTypes = {
    tree: PropTypes.object,
    node: PropTypes.object,
    pnode: PropTypes.object,
    depth: PropTypes.number,
    nodeCls: PropTypes.string
}
TreeNode.defaultProps = {
    depth: 0
}
export default TreeNode


// WEBPACK FOOTER //
// ./src/components/tree/TreeNode.js