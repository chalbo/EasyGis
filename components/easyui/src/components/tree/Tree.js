import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import treeHelper from '../base/TreeHelper';
import TreeNode from './TreeNode';

class Tree extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            highlightNode: null,
            editingItem: null,
            selection: props.selection,
            checkbox: props.checkbox
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selection !== this.props.selection){
            this.selectNode(nextProps.selection);
        }
    }
    getCheckedNodes(state = 'checked'){
        const {cascadeCheck,data} = this.props;
        let nodes = [];
        treeHelper.cascadeCheck = cascadeCheck;
        treeHelper.forNodes(data, (node) => {
            if (node.checkState === state){
                nodes.push(node);
            }
        });
        return nodes;
    }
    selectNode(node){
        const {selectLeafOnly} = this.props;
        const {selection} = this.state;
        if (node && node.children && node.children.length && selectLeafOnly){
            return;
        }
        if (selection !== node){
            this.setState({selection:node}, ()=>{
                this.props.onSelectionChange(node);
            });
        }
    }
    expandNode(node){
        if (node.state === 'closed'){
            node.state = 'open';
            this.setState({_:new Date()}, ()=>{
                this.props.onNodeExpand(node);
            })
        }
    }
    collapseNode(node){
        if (node.state !== 'closed'){
            node.state = 'closed';
            this.setState({_:new Date()}, ()=>{
                this.props.onNodeCollapse(node);
            })
        }
    }
    checkNode(node){
        const {cascadeCheck} = this.props;
        treeHelper.cascadeCheck = cascadeCheck;
        treeHelper.checkNode(node, ()=>{
            this.setState({_:new Date()}, ()=>{
                this.props.onNodeCheck(node);
                this.props.onCheckChange(this.getCheckedNodes());
            })
        });
    }
    uncheckNode(node){
        const {cascadeCheck} = this.props;
        treeHelper.cascadeCheck = cascadeCheck;
        treeHelper.uncheckNode(node, ()=>{
            this.setState({_:new Date()}, ()=>{
                this.props.onNodeUncheck(node);
                this.props.onCheckChange(this.getCheckedNodes());
            })
        });
    }
    uncheckAllNodes() {
        treeHelper.uncheckAllNodes(this.props.data, () => {
            this.setState({_:new Date()}, ()=>{
                this.props.onCheckChange([]);
            })
        });
    }
    doFilter(q){
        const {data,cascadeCheck} = this.props;
        let nodes = [];
        treeHelper.cascadeCheck = cascadeCheck;
        treeHelper.forNodes(data, (node) => {
            if (this.props.filter(q, node)){
                node.hidden = false;
                nodes.push(node);
            } else {
                node.hidden = true;
            }
        });
        for(let node of nodes){
            let pnode = node.parent;
            while(pnode){
                pnode.hidden = false;
                pnode = pnode.parent;
            }
            if (this.filterIncludingChild && node.children){
                treeHelper.forNodes(node.children, (node) => {
                    node.hidden = false;
                });
            }
        }
        this.setState({_:new Date()})
    }
    isEditing(node){
        if (this.state.editingItem){
            return this.state.editingItem.node === node;
        }
        return false;
    }
    beginEdit(node, el=null){
        if (!this.isEditing(node)){
            if (this.endEdit() === false){
                setTimeout(() => this.selectNode(this.state.editingItem.node))
            } else {
                this.setState({
                    editingItem: {
                        node: node,
                        originalValue: node.text,
                        element: el
                    }
                }, ()=>{
                    this.props.onEditBegin(this.state.editingItem);
                })
            }
        }
    }
    endEdit(){
        const {editingItem} = this.state;
        if (editingItem){
            let el = editingItem.element;
            if (el && el.querySelector('.validatebox-invalid')){
                return false;
            }
            this.props.onEditEnd(editingItem);
            this.setState({editingItem:null})
        }
    }
    cancelEdit(){
        const {editingItem} = this.state;
        if (editingItem){
            editingItem.node.text = editingItem.originalValue;
            this.props.onEditCancel(editingItem);
            this.setState({editingItem:null})
        }
    }
    render(){
        const treeCls = classHelper.classNames('tree', this.props.className);
        return (
            <ul className={treeCls} style={this.props.style}>
            {
                this.props.data.map((node,index) => {
                    return <TreeNode {...this.props} {...this.state} key={index} node={node} animate={this.props.animate} tree={this}></TreeNode>
                })
            }
            </ul>
        )
    }
}
Tree.propTypes = {
    data: PropTypes.array,
    selection: PropTypes.object,
    animate: PropTypes.bool,
    selectLeafOnly: PropTypes.bool,
    checkbox: PropTypes.bool,
    cascadeCheck: PropTypes.bool,
    clickToEdit: PropTypes.bool,
    dblclickToEdit: PropTypes.bool,
    filterIncludingChild: PropTypes.bool,
    filter: PropTypes.func,
    render: PropTypes.func,
    editor: PropTypes.func
}
Tree.defaultProps = {
    data: [],
    animate: false,
    selectLeafOnly: false,
    checkbox: false,
    cascadeCheck: true,
    clickToEdit: false,
    dblclickToEdit: false,
    filterIncludingChild: false,
    filter: (q,node) => {
        if (!q){
            return true;
        }
        let qq = (q instanceof Array) ? q : [q];
        qq = qq.map((q) => q.trim()).filter((q) => q);
        for(let i=0; i<qq.length; i++){
            let index = node.text.toLowerCase().indexOf(qq[i].toLowerCase());
            if (index >= 0){
                return true;
            }
        }
        return !qq.length;
    },
    onNodeClick(node){},
    onNodeDblClick(node){},
    onNodeExpand(node){},
    onNodeCollapse(node){},
    onNodeCheck(node){},
    onNodeUncheck(node){},
    onSelectionChange(node){},
    onCheckChange(nodes){},
    onNodeContextMenu({node,originalEvent}){},
    onEditBegin(editingItem){},
    onEditEnd(editingItem){},
    onEditCancel(editingItem){}
}
export default Tree



// WEBPACK FOOTER //
// ./src/components/tree/Tree.js