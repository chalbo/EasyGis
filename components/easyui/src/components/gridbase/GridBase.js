import React from 'react';
import PropTypes from 'prop-types';
import ListBase from '../base/ListBase';
import classHelper from '../base/ClassHelper';
import GridColumn from './GridColumn';
import GridView from './GridView';
import Pagination from '../pagination/Pagination';

class GridBase extends ListBase{
    constructor(props){
        super(props);
        this.destroyed = false;
        this.columnRefs = [];
        this.groupRefs = [];
        Object.assign(this.state, {
            leftGroup: null,
            rightGroup: null,
            centerGroup: null,
            leftColumns: [],
            rightColumns: [],
            centerColumns: [],
            sorts: props.sorts,
            editingItem: null,
            headerHeight: 0,
            splitStyle: null
        });
    }
    componentWillReceiveProps(nextProps){
        super.componentWillReceiveProps(nextProps);
        if (this.props.filterRules !== nextProps.filterRules){
            setTimeout(() => {
                this.doFilter();
            })
        }
    }
    componentDidMount(){
        super.componentDidMount();
        this.initColumns();
    }
    componentWillUnmount(){
        this.destroyed = true;
    }
    onColumnAdd(column){
        this.columnRefs.push(column);
        this.changeColumns()
    }
    onColumnRemove(column){
        let index = this.columnRefs.indexOf(column);
        if (index >= 0){
            this.columnRefs.splice(index,1);
            this.changeColumns()
        }
    }
    onColumnGroupAdd(group){
        this.groupRefs.push(group);
        this.changeColumns()
    }
    onColumnGroupRemove(group){
        let index = this.columnRefs.indexOf(group);
        if (index >= 0){
            this.groupRefs.splice(index,1);
            this.changeColumns()
        }
    }
    changeColumns(){
        if (this.destroyed){
            return;
        }
        clearTimeout(this.columnTimer);
        this.columnTimer = setTimeout(() => {
            this.initColumns();
            this.initHeaderHeight();
        })
    }
    footerRows(){
        const {footerData} = this.props;
        if (footerData instanceof Array){
            return footerData;
        } else {
            return [footerData];
        }
    }
    leftFrozenWidth() {
        const {leftGroup} = this.state;
        let width = leftGroup ? leftGroup.props.width : 0;
        return width ? width : this.props.frozenWidth;
    }
    rightFrozenWidth() {
        const {rightGroup} = this.state;
        let width = rightGroup ? rightGroup.props.width : 0;
        return width ? width : this.props.frozenWidth;
    }
    scrollTop(value){
        if (value !== undefined){
            this.view2.body.bodyRef.scrollTop = value;
        } else {
            return this.view2.body.bodyRef.scrollTop;
        }
    }
    initColumns(){
        const {columnRefs,groupRefs} = this;
        let newState = {
            leftGroup: null,
            leftColumns: null,
            rightGroup: null,
            rightColumns: null,
            centerGroup: null,
            centerColumns: null
        };
        if (groupRefs && groupRefs.length){
            groupRefs.forEach((g) => {
                let cc = this.getColumnLayout(g);
                let columns = cc[cc.length-1];
                if (g.props.frozen){
                    if (g.props.align === 'left'){
                        newState.leftGroup = g;
                        newState.leftColumns = columns;
                    } else {
                        newState.rightGroup = g;
                        newState.rightColumns = columns;
                    }
                } else {
                    newState.centerGroup = g;
                    newState.centerColumns = columns;
                }
            });
        }
        if (!newState.centerColumns) {
            newState.centerColumns = columnRefs.filter((c) => {
                return !c.props.frozen;
            });
            let frozenColumns = columnRefs.filter((c) => {
                return c.props.frozen;
            });
            if (frozenColumns.length){
                if (this.props.frozenAlign === 'left'){
                    newState.leftColumns = frozenColumns;
                } else {
                    newState.rightColumns = frozenColumns;
                }
            }
        }
        this.setState(newState)
        this.initColumnSort();
    }
    initHeaderHeight(){
        if (this.view1){
            this.view1.headerHeight(null);
        }
        if (this.view2){
            this.view2.headerHeight(null);
        }
        if (this.view3){
            this.view3.headerHeight(null);
        }
        let h1 = this.view1 ? this.view1.headerHeight() : 0;
        let h2 = this.view2 ? this.view2.headerHeight() : 0;
        let h3 = this.view3 ? this.view3.headerHeight() : 0;
        this.headerHeight = Math.max(h1, h2, h3);
        if (this.view1){
            this.view1.headerHeight(this.headerHeight);
        }
        if (this.view2){
            this.view2.headerHeight(this.headerHeight);
        }
        if (this.view3){
            this.view3.headerHeight(this.headerHeight);
        }
    }
    initColumnSort() {
        const {multiSort} = this.props;
        let sorts = this.state.sorts;
        this.sortsState = this.sortsState || [];
        if (!(sorts instanceof Array)){
            sorts = [sorts];
        }
        if (!multiSort){
            sorts = sorts.slice(0, 1);
        }
        this.setState({sorts:sorts});
        let allColumns = this.allColumns();
        for(let c=0; c<allColumns.length; c++){
            let col = allColumns[c];
            col.currOrder = null;
            for(let s=0; s<sorts.length; s++){
                let sort = sorts[s];
                if (sort.field === col.props.field){
                    col.currOrder = sort.order;
                    break;
                }
            }
        }
    }
    initFilterRules(){
        const {filterRules} = this.props;
        filterRules.forEach(r => {
            let col = this.findColumn(r.field);
            if (col){
                col.filterValue = r.value;
                col.filterOperator = r.op;
            }
        });
    }
    addFilterRule(rule) {
        super.addFilterRule(rule);
        let col = this.findColumn(rule.field);
        if (col){
            col.filterValue = rule.value;
            col.filterOperator = rule.op;
        }
    }
    addSort(col) {
        const {multiSort} = this.props;
        const {sorts} = this.state;
        let index = -1;
        for(let i=0; i<sorts.length; i++){
            if (sorts[i].field === col.props.field){
                index = i;
                break;
            }
        }
        if (index >= 0){
            let nextOrder = sorts[index].order === 'asc' ? 'desc' : 'asc';
            if (multiSort && nextOrder === col.props.order){
                this.setState({sorts: sorts.filter((_,idx)=>idx!==index)})
            } else {
                sorts[index].order = nextOrder;
                this.setState({sorts: Object.assign([],sorts)});
            }
        } else {
            let sortItem = {
                field: col.props.field,
                order: col.props.order
            };
            if (multiSort){
                this.setState({sorts: [...sorts,sortItem]});
            } else {
                this.setState({sorts: [sortItem]});
            }
        }
        this.setState({}, ()=>{
            this.initColumnSort();
        })
    }
    allColumns() {
        const {leftColumns,centerColumns,rightColumns} = this.state;
        let cc = [];
        if (leftColumns){
            cc = cc.concat(leftColumns);
        }
        if (centerColumns){
            cc = cc.concat(centerColumns);
        }
        if (rightColumns){
            cc = cc.concat(rightColumns);
        }
        return cc;
    }
    moveColumn(fromField,toField,point){
        let leftCount = (this.state.leftColumns||[]).length;
        let centerCount = (this.state.centerColumns||[]).length;
        let rightCount = (this.state.rightColumns||[]).length;
        let columns = this.allColumns().slice();
        let fromIndex = columns.findIndex(col => col.props.field===fromField);
        let fromCol = columns[fromIndex];
        let toIndex = columns.findIndex(col => col.props.field===toField);
        let toCol = columns[toIndex];
        columns.splice(fromIndex, 1);
        toIndex = columns.findIndex(col => col===toCol);
        columns.splice(toIndex+(point==='before'?0:1), 0, fromCol);
        let leftColumns = columns.splice(0, leftCount);
        let centerColumns = columns.splice(0, centerCount);
        let rightColumns = columns.splice(0, rightCount);
        
        this.setState({
            leftColumns: leftColumns.length?leftColumns:null,
            centerColumns: centerColumns,
            rightColumns: rightColumns.length?rightColumns:null,
            splitStyle: null
        }, ()=>{
            this.props.onColumnMove({
                from: fromCol,
                to: toCol,
                point: point
            })
        })
    }
    resizeColumn(field, width){
        const col = this.findColumn(field);
        if (col){
            col.setState({width:width}, ()=>{
                this.setState({_t:new Date()}, ()=>{
                    this.props.onColumnResize(col)
                })
            })
        }
    }
    findColumn(field) {
        let cc = this.allColumns();
        for(let i=0; i<cc.length; i++){
            if (cc[i].props.field === field){
                return cc[i];
            }
        }
        return null;
    }
    getColumnLayout(group){
        let aa = [];
        let count = this.getColumnCount(group);
        for(let i=0; i<group.rows.length; i++){
            aa[i] = new Array(count);
        }
        group.rows.forEach((row,rowIndex) => {
            row.columns.forEach(col => {
                let colIndex = this.getColumnIndex(aa[rowIndex]);
                if (colIndex >= 0){
                    for(let c=0; c<col.props.colspan; c++){
                        for(let r=0; r<col.props.rowspan; r++){
                            aa[rowIndex+r][colIndex] = col||'';
                        }
                    }
                }
            })
        });
        return aa;
    }
    getColumnCount(group){
        let count = 0;
        group.rows[0].columns.forEach(col => {
            count += Number(col.props.colspan);
        });
        return count;
    }
    getColumnIndex(a){
        for(let i=0; i<a.length; i++){
            if (a[i] === undefined){
                return i;
            }
        }
        return -1;
    }
    isEditing(row, column = null){
        const {editMode,idField} = this.props;
        const {editingItem} = this.state;
        if (editMode && editingItem){
            if (editMode === 'cell' && editingItem.column !== column){
                return false;
            }
            if (idField){
                if (editingItem.row[idField] === row[idField]){
                    return true;
                }
            } else {
                if (editingItem.row === row){
                    return true;
                }
            }
        }
        return false;
    }
    beginEdit(row, column = null, rowEl = null) {
        const {editMode} = this.props;
        const {editingItem} = this.state;
        if (!this.isEditing(row, column)){
            if (!this.endEdit()){
                setTimeout(() => {
                    if (editMode === 'row'){
                        this.selectRow(editingItem.row);
                    } else if (editMode === 'cell'){
                        this.selectCell(editingItem.row, editingItem.column);
                    }
                });
                return;
            }
            let originalValue = editMode === 'row' ? Object.assign({}, row) : row[column.field];
            this.setState({editingItem: {
                row: row,
                column: column,
                originalValue: originalValue,
                element: rowEl
            }}, ()=>{
                this.props.onEditBegin(this.state.editingItem)
            });
        }
    }
    endEdit() {
        const {editingItem} = this.state;
        if (editingItem){
            let el = editingItem.element;
            if (el && el.querySelector('.validatebox-invalid')){
                return false;
            }
            let errors = editingItem.errors || {};
            let errorCount = 0;
            for(let field in errors){
                errorCount += errors[field].length;
            }
            if (errorCount > 0){
                return false;
            }
            this.setState({editingItem:null}, ()=>{
                this.props.onEditEnd(editingItem);
            });
        }
        return true;
    }
    cancelEdit() {
        const {editMode} = this.props;
        const {editingItem} = this.state;
        if (editingItem){
            if (editMode === 'cell'){
                editingItem.row[editingItem.column.field] = editingItem.originalValue;
            } else {
                Object.assign(editingItem.row, editingItem.originalValue);
            }
            this.setState({editingItem:null}, ()=>{
                this.props.onEditCancel(editingItem);
            })
        }
    }
    handleBodyScroll(event){
        let top = event ? event.top : this.view2.scrollTop();
        if (this.view1){
            this.view1.scrollTop(top);
        }
        if (this.view3){
            this.view3.scrollTop(top);
        }
    }
    viewComponent(){
        return <GridView></GridView>
    }
    renderPagination(position){
        const {loading,pagination,pagePosition,pageOptions} = this.props;
        const {total,pageNumber,pageSize} = this.state;
        const cls = 'datagrid-pager f-noshrink datagrid-pager-'+position;
        if (!pagination){
            return null;
        }
        if (pagePosition !== 'both' && pagePosition !== position){
            return null;
        }
        return (
            <Pagination className={cls}
                {...pageOptions}
                total={total}
                pageNumber={pageNumber}
                pageSize={pageSize}
                loading={loading}
                onPageChange={this.handlePageChange.bind(this)}
            />
        )
    }
    renderLoading(){
        const {loading, defaultLoadMsg} = this.props;
        const loadMsg = this.t('ListBase.loadMsg', defaultLoadMsg);
        if (!loading){
            return null;
        }
        return (
            <div className="datagrid-loading f-row">
                <div className="datagrid-mask"></div>
                <div className="datagrid-mask-msg">{loadMsg}</div>
            </div>
        )
    }
    renderSplitHelper(){
        const {splitStyle} = this.state;
        if (splitStyle){
            return <div className="datagrid-split-proxy" style={splitStyle}></div>
        } else {
            return null;
        }
    }
    renderColumns(){
        return (
            <div>
                {
                    React.Children.map(this.props.children, (child) => {
                        const events = child.type === GridColumn
                            ? {
                                grid: this,
                                onColumnAdd: this.onColumnAdd.bind(this),
                                onColumnRemove: this.onColumnRemove.bind(this)
                            }
                            : {
                                grid: this,
                                onColumnGroupAdd: this.onColumnGroupAdd.bind(this),
                                onColumnGroupRemove: this.onColumnGroupRemove.bind(this)
                            }
                        return React.cloneElement(child, events)
                    })
                }
            </div>
        )
    }
    renderToolbar(){
        const {toolbar} = this.props;
        if (!toolbar){
            return null;
        }
        return(
            <div className="datagrid-toolbar f-noshrink">
            {
                toolbar({editingItem:this.state.editingItem})
            }
            </div>
        )
    }
    renderView(viewIndex){
        const {virtualScroll} = this.props;
        const {leftGroup,leftColumns,centerGroup,centerColumns,rightGroup,rightColumns,rows,frozenRows} = this.state;
        let group = null;
        let columns = null;
        let style = null;
        if (viewIndex === 1){
            group = leftGroup;
            columns = leftColumns;
            style = {width:this.leftFrozenWidth()}
        } else if (viewIndex === 2){
            group = centerGroup;
            columns = centerColumns;
        } else if (viewIndex === 3){
            group = rightGroup;
            columns = rightColumns;
            style = {width:this.rightFrozenWidth()}
        }
        if (group || columns){
            return React.cloneElement(this.viewComponent(), Object.assign({}, this.props, this.state, {
                viewIndex: viewIndex,
                columnGroup: group,
                columns: columns,
                rows: viewIndex===2?rows:(virtualScroll?frozenRows:rows),
                footerRows: this.footerRows(),
                style: style,
                grid: this,
                ref: ref=>{
                    this['view'+viewIndex] = ref
                },
                onBodyScroll: viewIndex===2?this.handleBodyScroll.bind(this):()=>{}
            }))
        } else {
            return null;
        }
    }
    render(){
        const {border} = this.props;
        const gridCls = classHelper.classNames('f-column panel-noscroll', this.props.className);
        const bodyCls = classHelper.classNames('panel-body panel-body-noheader datagrid datagrid-wrap f-full f-column', {
            'panel-body-noborder':!border
        });
        return (
            <div className={gridCls} style={this.props.style} ref={el=>this.el=el}>
                <div className={bodyCls}>
                    {this.renderColumns()}
                    {this.renderToolbar()}
                    {this.renderPagination('top')}
                    <div className="datagrid-view f-row f-full" ref={el=>this.viewRef=el}>
                        {this.renderView(1)}
                        {this.renderView(2)}
                        {this.renderView(3)}
                        {this.renderSplitHelper()}
                    </div>
                    {this.renderPagination('bottom')}
                </div>
                {this.renderLoading()}
            </div>
        )
    }
}
GridBase.propTypes = Object.assign({}, ListBase.propTypes, {
    striped: PropTypes.bool,
    columnMoving: PropTypes.bool,
    rowCss: PropTypes.oneOfType([PropTypes.object,PropTypes.func]),
    frozenWidth: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    frozenAlign: PropTypes.string,
    sorts: PropTypes.oneOfType([PropTypes.object,PropTypes.array]),
    multiSort: PropTypes.bool,
    showHeader: PropTypes.bool,
    showFooter: PropTypes.bool,
    editMode: PropTypes.string,
    clickToEdit: PropTypes.bool,
    dblclickToEdit: PropTypes.bool,
    footerData: PropTypes.array,
    filterRules: PropTypes.array
})
GridBase.defaultProps = Object.assign({}, ListBase.defaultProps, {
    striped: false,
    columnMoving: false,
    columnResizing: false,
    frozenWidth: '200px',
    frozenAlign: 'left',
    sorts: [],
    multiSort: false,
    showHeader: true,
    showFooter: false,
    clickToEdit: false,
    dblclickToEdit: false,
    footerData: [],
    filterRules: [],
    onSortChange(){},
    onRowContextMenu({row,originalEvent}){},
    onCellContextMenu({row,column,originalEvent}){},
    onEditBegin(editingItem){},
    onEditEnd(editingItem){},
    onEditCancel(editingItem){},
    onEditValidate(editingItem){},
    onColumnMove({from,to,point}){},
    onColumnResize(column){}
})
export default GridBase


// WEBPACK FOOTER //
// ./src/components/gridbase/GridBase.js