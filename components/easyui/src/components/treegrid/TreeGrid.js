import React from 'react';
import PropTypes from 'prop-types';
import treeHelper from '../base/TreeHelper';
import GridBase from '../gridbase/GridBase';
import TreeGridView from './TreeGridView';

class TreeGrid extends GridBase{
    getCheckedRows(state = 'checked'){
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
    expandRow(row){
        if (row.state === 'closed'){
            row.state = 'open';
            this.setState({_:new Date()}, ()=>{
                this.props.onRowExpand(row);
            })
        }
    }
    collapseRow(row){
        if (row.state !== 'closed'){
            row.state = 'closed';
            this.setState({_:new Date()}, ()=>{
                this.props.onRowCollapse(row);
            })
        }
    }
    checkRow(row){
        const {cascadeCheck} = this.props;
        treeHelper.cascadeCheck = cascadeCheck;
        treeHelper.checkNode(row, ()=>{
            this.setState({_:new Date()}, ()=>{
                this.props.onRowCheck(row);
                this.props.onCheckChange(this.getCheckedRows());
            })
        });
    }
    uncheckRow(row){
        const {cascadeCheck} = this.props;
        treeHelper.cascadeCheck = cascadeCheck;
        treeHelper.uncheckNode(row, ()=>{
            this.setState({_:new Date()}, ()=>{
                this.props.onRowUncheck(row);
                this.props.onCheckChange(this.getCheckedRows());
            })
        });
    }
    uncheckAllRows() {
        treeHelper.uncheckAllNodes(this.props.data, () => {
            this.setState({_:new Date()}, ()=>{
                this.props.onCheckChange([]);
            })
        });
    }
    sortData() {
        const {sorts} = this.state;
        if (!sorts.length){
            return;
        }
        let cc = [];
        for(let i=0; i<sorts.length; i++){
            cc.push(this.findColumn(sorts[i].field));
        }
        let sortFunc = (a,b) => {
            return a===b ? 0 : (a>b?1:-1);
        };
        let _sort = (rows) => {
            rows.sort((r1,r2) => {
                let r = 0;
                for(let i=0; i<sorts.length; i++){
                    let sort = sorts[i];
                    if (cc[i] && cc[i].props.sorter){
                        r = cc[i].sorter(r1, r2);
                    } else {
                        r = sortFunc(r1[sort.field], r2[sort.field]);
                    }
                    r = r * (sort.order==='asc' ? 1 : -1);
                    if (r !== 0){
                        return r;
                    }
                }
                return r;
            });
            rows.forEach(row => {
                if (row.children && row.children.length){
                    _sort(row.children);
                }
            });
        };
        _sort(this.innerData);
    }
    viewComponent(){
        return <TreeGridView></TreeGridView>
    }
}
TreeGrid.propTypes = Object.assign({}, GridBase.propTypes, {
    idField: PropTypes.string,
    treeField: PropTypes.string,
    checkbox: PropTypes.bool,
    cascadeCheck: PropTypes.bool,
    animate: PropTypes.bool
})
TreeGrid.defaultProps = Object.assign({}, GridBase.defaultProps, {
    selectionMode: 'single',
    checkbox: false,
    cascadeCheck: true,
    animate: false,
    onRowExpand(row){},
    onRowCollapse(row){},
    onRowCheck(row){},
    onRowUncheck(row){},
    onCheckChange(rows){}
})
export default TreeGrid


// WEBPACK FOOTER //
// ./src/components/treegrid/TreeGrid.js