import React from 'react';
import classHelper from '../base/ClassHelper';
import GridBodyRow from '../gridbase/GridBodyRow';
import TreeGridTitle from './TreeGridTitle';

class TreeGridRow extends GridBodyRow{
    constructor(props){
        super(props);
        this.loading = false;
    }
    componentDidMount(){
        this.props.row.parent = this.props.prow;
    }
    isTreeField(field) {
        return field === this.props.grid.props.treeField;
    }
    isEditable(row,col) {
        if (this.props.grid.isEditing(row, col)){
            if (col.props.editable){
                return true;
            }
        }
        return false;
    }
    isLeaf() {
        const {row} = this.props;
        if (row.state === 'closed'){
            return false;
        } else {
            if (row.children && row.children.length){
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
    isExpanded() {
        const {row} = this.props;
        if (!row.state || row.state === 'open'){
            return true;
        } else {
            return false;
        }
    }
    isCollapsed() {
        const {row} = this.props;
        if (row.state && row.state === 'closed'){
            return true;
        } else {
            return false;
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
    handleHitClick(event){
        const {row,grid} = this.props;
        event.stopPropagation();
        if (this.isExpanded()){
            grid.collapseRow(row);
        } else {
            this.loading = true;
            grid.expandRow(row);
        }
    }
    handleCheckClick(event){
        const {row,grid} = this.props;
        event.stopPropagation();
        if (row.checkState === 'checked'){
            grid.uncheckRow(row);
        } else {
            grid.checkRow(row);
        }
    }
    hitClasses(){
        return classHelper.classNames(['tree-hit', {
            'tree-expanded': this.isExpanded(),
            'tree-collapsed': this.isCollapsed()
        }]);
    }
    iconClasses(){
        return classHelper.classNames(['tree-icon tree-folder', this.props.row.iconCls, {
            'tree-folder-open': this.isExpanded(),
            'tree-file': this.isLeaf(),
            'tree-loading': this.loading
        }]);
    }
    checkboxClasses() {
        let cc = ['unchecked','checked','indeterminate'];
        let index = cc.indexOf(this.props.row.checkState);
        if (index === -1){
            index = 0;
        }
        return 'tree-checkbox tree-checkbox' + index;
    }
    renderCell(col){
        const {grid,row} = this.props;
        const {checkbox} = grid.props;
        if (!this.isTreeField(col.props.field) || this.isEditable(row,col)){
            return super.renderCell(col);
        } else {
            const cellCls = classHelper.classNames('datagrid-cell', {
                'datagrid-editable': this.isEditable(row,col)
            });
            return (
                <div className={cellCls}>
                    <span className="tree-indent" style={{width:this.indentWidth()}}></span>
                    {!this.isLeaf() && <span className={this.hitClasses()} onClick={event=>this.handleHitClick(event)}></span>}
                    <span className={this.iconClasses()}></span>
                    {checkbox && <span className={this.checkboxClasses()} onClick={event=>this.handleCheckClick(event)}></span>}
                    <TreeGridTitle row={row} column={col}></TreeGridTitle>
                </div>
            )
        }
    }
}
export default TreeGridRow


// WEBPACK FOOTER //
// ./src/components/treegrid/TreeGridRow.js