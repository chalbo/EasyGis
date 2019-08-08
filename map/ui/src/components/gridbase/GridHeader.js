import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import GridFilterRow from './GridFilterRow';
import { Draggable } from '../draggable';
import { Droppable } from '../droppable';
import { Resizable } from '../resizable';

class GridHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hoverColumn: null,
            dragScope: null,
            proxyCls: null
        }
    }
    height(value){
        if (value === undefined){
            return domHelper.outerHeight(this.contentRef);
        } else {
            let height = value ? (value)+'px' : value;
            this.contentRef.style.height = height;
        }
    }
    scrollLeft(value){
        if (value === undefined){
            return this.state.scrollLeft;
        } else {
            this.headerRef.scrollLeft = value;
        }
    }
    filterOnTop(){
        const {filterable,filterPosition} = this.props.grid.props; 
        if (filterable){
            if (filterPosition === 'both' || filterPosition === 'top'){
                return true;
            }
        }
        return false;    
    }
    filterOnBottom(){
        const {filterable,filterPosition} = this.props.grid.props; 
        if (filterable){
            if (filterPosition === 'both' || filterPosition === 'bottom'){
                return true;
            }
        }
        return false;
    }
    handleMouseEnter(column){
        return () => {
            this.setState({hoverColumn:column})
        }
    }
    handleMouseLeave(){
        return () => {
            this.setState({hoverColumn:null})
        }
    }
    handleCellClick(column,event){
        this.props.onCellClick({
            column: column,
            originalEvent: event
        })
    }
    handleFilterCellFocus(){
        this.props.grid.view2.body.scrollLeft(this.headerRef.scrollLeft);
    }
    handleColumnDragStart(column,event){
        this.setState({
            dragScope: {
                column: column,
                event: event,
                fromIndex: this.props.grid.allColumns().indexOf(column),
                viewOffset: domHelper.offset(this.props.grid.viewRef)
            }
        });
    }
    handleColumnDragOver(scope, column){
        if (!scope){
            return;
        }
        scope.toIndex = this.props.grid.allColumns().indexOf(column);
        const diff = scope.fromIndex - scope.toIndex;
        scope.point = diff === 0 ? null : (diff < 0 ? 'after' : 'before');
        let splitStyle = null;
        if (diff !== 0){
            let el = scope.event.currDroppable.el;
            let offset = domHelper.offset(el);
            let left = offset.left - scope.viewOffset.left;
            if (scope.toIndex !== 0){
                left -= 1;
            }
            splitStyle = {
                left: diff<0 ? left+domHelper.outerWidth(el) : left,
                top: 0
            };
        }
        this.props.grid.setState({splitStyle:splitStyle})
    }
    handleColumnDragLeave(){
        this.props.grid.setState({splitStyle:null})
    }
    handleColumnDrop(scope,column){
        if (!scope){
            return;
        }
        this.setState({dragScope:null}, ()=>{
            if (scope.point){
                this.props.grid.moveColumn(scope.column.props.field, column.props.field, scope.point);
            }
        })
    }
    handleColumnResizing(column,event){
        event.target.style.width = null;
        event.target.style.left = null;
        event.target.style.top = null;
        this.props.grid.resizeColumn(column.props.field, event.width)
    }
    handleColumnResizeStop(column,event){
        event.target.style.width = null;
        event.target.style.left = null;
        event.target.style.top = null;
        this.props.grid.resizeColumn(column.props.field, event.width)
    }
    renderCell(column,index){
        const {field,title,rowspan,colspan,sortable,halign,align,header,grid} = column.props;
        const tdCls = classHelper.classNames({
            'datagrid-field-td': field,
            'datagrid-header-over': (this.state.hoverColumn===column && sortable)
        })
        const cellCls = classHelper.classNames('datagrid-cell', {
            'datagrid-sort': field && sortable,
            'datagrid-sort-asc': column.currOrder==='asc',
            'datagrid-sort-desc': column.currOrder==='desc'
        })
        const proxy = () => {
            return (
                <div className="datagrid-moving-proxy">{title}</div>
            )
        }
        let cell = (
            <td key={index}
                className={tdCls}
                rowSpan={rowspan}
                colSpan={colspan}
                onMouseEnter={this.handleMouseEnter(column)}
                onMouseLeave={this.handleMouseLeave()}
                onClick={(event)=>this.handleCellClick(column,event)}
            >
                <div className={cellCls} style={{textAlign:halign||align||null}}>
                    <span>{header ? header({column:column,colIndex:index}) : title}</span>
                    <span className="datagrid-sort-icon"></span>
                </div>
            </td>
        )
        if (grid.props.columnMoving){
            cell = (
                <Draggable 
                    key={index} 
                    revert 
                    proxy={proxy}
                    proxyWrap={<td></td>}
                    deltaX={0}
                    deltaY={0}
                    edge={5}
                    scope={this.state.dragScope}
                    onDragStart={(event)=>this.handleColumnDragStart(column,event)}
                >
                    <Droppable
                        onDragOver={(scope)=>this.handleColumnDragOver(scope,column)}
                        onDragLeave={(scope)=>this.handleColumnDragLeave(scope,column)}
                        onDrop={(scope)=>this.handleColumnDrop(scope,column)}
                    >
                    {cell}
                    </Droppable>
                </Draggable>
            )
        }
        if (grid.props.columnResizing && field){
            cell = (
                <Resizable
                    key={index}
                    handles="e"
                    onResizing={(event)=>this.handleColumnResizing(column,event)}
                    onResizeStop={(event)=>this.handleColumnResizeStop(column,event)}
                >
                    {cell}
                </Resizable>
            )
        }
        return cell;
    }
    renderCells(columns){
        return (
            <tr className="datagrid-header-row">
            {
                columns.map((col,index) => {
                    return this.renderCell(col, index)
                })
            }
            </tr>
        )
    }
    renderFilterRow(position){
        if ((position === 'top' && this.filterOnTop()) ||
            (position === 'bottom' && this.filterOnBottom())){
            return <GridFilterRow columns={this.props.columns} grid={this.props.grid} onFilterCellFocus={this.handleFilterCellFocus.bind(this)}></GridFilterRow>
        } else {
            return null;
        }
    }
    renderRowCells(){
        const {columns,columnGroup} = this.props;
        if (columnGroup || !columns.length){
            return null;
        }
        return (
            <tbody>
                {this.renderFilterRow('top')}
                {this.renderCells(columns)}
                {this.renderFilterRow('bottom')}
            </tbody>
        )
    }
    renderGroupCells(){
        const {columnGroup} = this.props;
        if (!columnGroup){
            return null;
        }
        return (
            <tbody>
                {this.renderFilterRow('top')}
                {
                    columnGroup.rows.map((row,index) => {
                        return React.Children.map(this.renderCells(row.columns), child => {
                            return React.cloneElement(child, {
                                key: index
                            })
                        })
                    })
                }
                {this.renderFilterRow('bottom')}
            </tbody>
        )
    }
    render(){
        const {columns,paddingWidth} = this.props;
        return (
            <div className="datagrid-header f-row f-noshrink">
                <div className="datagrid-header-inner f-full" ref={ref=>this.headerRef=ref}>
                    <table className="datagrid-htable" border="0" cellSpacing="0" cellPadding="0" ref={ref=>this.contentRef=ref}>
                        <colgroup>
                            {
                                columns.map((col,index) => {
                                    return <col key={index} style={{width:col.state.width}}></col>
                                })
                            }
                        </colgroup>
                        {this.renderGroupCells()}
                        {this.renderRowCells()}
                    </table>
                </div>
                {
                    paddingWidth>0 && <div className="datagrid-header f-noshrink" style={{width:paddingWidth+'px'}}></div>
                }
            </div>
        )
    }
}
GridHeader.propTypes = {
    columns: PropTypes.array,
    columnGroup: PropTypes.object,
    paddingWidth: PropTypes.number,
    filterable: PropTypes.bool
}
GridHeader.defaultProps = {
    columns: [],
    paddingWidth: 0,
    filterable: false,
    onCellClick(){}
}
export default GridHeader



// WEBPACK FOOTER //
// ./src/components/gridbase/GridHeader.js