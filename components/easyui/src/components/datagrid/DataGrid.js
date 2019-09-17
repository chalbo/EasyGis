import React from 'react';
import PropTypes from 'prop-types';
import GridBase from '../gridbase/GridBase';
import DataGridView from './DataGridView';

class DataGrid extends GridBase{
    constructor(props){
        super(props);
        this.groupData = [];
        Object.assign(this.state, {
            frozenRows: [],
            expandedRows: []
        })
    }
    frozenRows(){
        return this.props.virtualScroll ? [] : this.state.rows;
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
        this.innerData.sort((r1,r2) => {
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
    }
    setGroupData(){
        const {groupField} = this.props;
        if (groupField){
            if (!this.isGrouped(this.filteredData)){
                this.groupData = this.makeGroup(this.filteredData);
                this.filteredData = this.makeGroupedRows();
                let index = 0;
                this.filteredData.forEach(row => {
                    if (!this.isGroupRow(row)){
                        row._rowIndex = index++;
                    }
                });
            }
        }
    }
    isGroupRow(row){
        return row._groupRow ? true : false;
    }
    isGrouped(data){
        if (data && data.length){
            if (this.isGroupRow(data[0])){
                return true;
            }
        }
        return false;
    }
    getGroup(value, groups) {
        if (!groups){
            groups = this.groupData;
        }
        for(let group of groups){
            if (group.value === value){
                return group;
            }
        }
        return null;
    }
    makeGroup(data) {
        const {groupField} = this.props;
        let groups = [];
        for(let row of data){
            if (!this.isGroupRow(row)){
                let group = this.getGroup(row[groupField], groups);
                if (group){
                    group.rows.push(row);
                } else {
                    group = {
                        value: row[groupField],
                        collapsed: false,
                        rows: [row]
                    };
                    groups.push(group);
                }
            }
        }
        return groups;
    }
    makeGroupedRows() {
        let rows = [];
        for(let group of this.groupData){
            rows.push({
                _groupRow: true,
                value: group.value,
                rows: group.rows,
                collapsed: group.collapsed
            });
            if (!group.collapsed){
                rows = rows.concat(group.rows);
            }
        }
        return rows;
    }
    collapseGroup(value) {
        let group = this.getGroup(value);
        if (group){
            group.collapsed = true;
            this.setState({rows:this.makeGroupedRows()}, ()=>{
                this.props.onGroupCollapse(group);
            })
        }
    }
    expandGroup(value) {
        let group = this.getGroup(value);
        if (group){
            group.collapsed = false;
            this.setState({rows:this.makeGroupedRows()}, ()=>{
                this.props.onGroupExpand(group);
            })
        }
    }
    toggleGroup(value) {
        let group = this.getGroup(value);
        if (group){
            if (group.collapsed){
                this.expandGroup(value);
            } else {
                this.collapseGroup(value);
            }
        }
    }
    updateFrozenView(scrollTop, rows){
        if (rows){
            this.setState({frozenRows:rows})
        }
        if (this.view1){
            this.view1.scrollTop(scrollTop);
        }
        if (this.view3){
            this.view3.scrollTop(scrollTop);
        }
    }
    getAbsoluteIndex(index){
        const {pageNumber,pageSize} = this.state;
        let body = this.view2.body;
        if (body.vscroll){
            return index + body.vscroll.startIndex;
        } else if (this.props.pagination){
            return index + (pageNumber - 1) * pageSize;
        } else {
            return index;
        }
    }
    getExpandedIndex(row){
        const {idField} = this.props;
        const {expandedRows} = this.state;
        if (idField){
            for(let i=0; i<expandedRows.length; i++){
                if (expandedRows[i][idField] === row[idField]){
                    return i;
                }
            }
            return -1;
        } else {
            return expandedRows.indexOf(row);
        }
    }
    isRowExpanded(row) {
        let index = this.getExpandedIndex(row);
        return index !== -1;
    }
    collapseRow(row){
        let index = this.getExpandedIndex(row);
        if (index >= 0){
            this.setState({
                expandedRows: this.state.expandedRows.filter((_,idx)=>idx!==index)
            }, ()=>{
                this.props.onRowCollapse(row);
            })
        }
    }
    expandRow(row){
        if (!this.isRowExpanded(row)){
            this.setState({
                expandedRows: [...this.state.expandedRows, row]
            }, ()=>{
                this.props.onRowExpand(row);
            })
        }
    }
    toggleRow(row){
        if (this.isRowExpanded(row)){
            this.collapseRow(row);
        } else {
            this.expandRow(row);
        }
    }
    viewComponent(){
        return <DataGridView></DataGridView>
    }
    handleBodyScroll(event){
        this.updateFrozenView(event.relativeTop||event.top, event.items);
    }
}
DataGrid.propTypes = Object.assign({}, GridBase.propTypes, {
    groupField: PropTypes.string,
    expanderWidth: PropTypes.number,
    renderDetail: PropTypes.func,
    renderGroup: PropTypes.func
})
DataGrid.defaultProps = Object.assign({}, GridBase.defaultProps, {
    expanderWidth: 30,
    onGroupCollapse(group){},
    onGroupExpand(group){},
    onRowCollapse(row){},
    onRowExpand(row){}
})
export default DataGrid


// WEBPACK FOOTER //
// ./src/components/datagrid/DataGrid.js