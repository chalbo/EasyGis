import React from 'react';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import LocaleBase from '../base/LocaleBase';
import GridBodyCell from './GridBodyCell';

class GridBodyRow extends LocaleBase{
    doEdit(row, col, rowEl, cellEl){
        this.props.grid.beginEdit(row, col, rowEl);
        setTimeout(() => {
            let input = cellEl.querySelector('.textbox-text');
            if (input){
                input.focus();
            }
        });
    }
    getCss(css, row, value, type){
        if (css){
            let cssValue = typeof css === 'function' ? css(row, value) : css;
            if (type === 'class'){
                return typeof cssValue === 'string' ? cssValue : null;
            } else {
                return typeof cssValue === 'object' ? cssValue : null;
            }
        }
        return null;
    }
    getRowClass(row) {
        return this.getCss(this.props.grid.props.rowCss, row, null, 'class');
    }
    getRowStyle(row) {
        return this.getCss(this.props.grid.props.rowCss, row, null, 'style');
    }
    getCellClass(column, row){
        return this.getCss(column.props.cellCss, row, row[column.props.field], 'class');
    }
    getCellStyle(column, row){
        return this.getCss(column.props.cellCss, row, row[column.props.field], 'style');
    }
    handleRowMouseEnter(row){
        this.props.grid.setState({highlightRow:row})
    }
    handleRowMouseLeave(){
        this.props.grid.setState({highlightRow:null})
    }
    handleCellMouseEnter(cell){
        this.props.grid.setState({highlightCell:cell})
    }
    handleCellMouseLeave(){
        this.props.grid.setState({highlightCell:null})
    }
    handleRowClick(row){
        const {grid} = this.props;
        grid.handleRowClick(row);
    }
    handleRowDblClick(row){
        this.props.grid.props.onRowDblClick(row);
    }
    handleRowContextMenu(row,event){
        this.props.grid.props.onRowContextMenu({row:row,originalEvent:event});
    }
    handleCellClick(row,col,event){
        const {grid} = this.props;
        const {clickToEdit,dblclickToEdit} = grid.props;
        let cellEl = domHelper.closest(event.target, '.datagrid-td');
        if (!cellEl){
            return;
        }
        let rowEl = domHelper.closest(cellEl, '.datagrid-row');
        grid.handleCellClick(row, col, event);
        if (clickToEdit || (dblclickToEdit && grid.state.editingItem)){
            this.doEdit(row, col, rowEl, cellEl);
        }
    }
    handleCellDblClick(row,col,event){
        const {grid} = this.props;
        const {dblclickToEdit} = grid.props;
        let cellEl = domHelper.closest(event.target, '.datagrid-td');
        let rowEl = domHelper.closest(cellEl, '.datagrid-row');
        grid.props.onCellDblClick({row:row, column:col});
        if (dblclickToEdit){
            this.doEdit(row, col, rowEl, cellEl);
        }
    }
    handleCellContextMenu(row,col,event){
        this.props.grid.props.onCellContextMenu({row:row,column:col,originalEvent:event});
    }
    renderCell(col){
        const {row,rowIndex,grid} = this.props;
        const cellProps = {
            row: row,
            column: col,
            rowIndex: rowIndex,
            grid: grid,
            isEditable: (col.props.editable && grid.isEditing(row,col))
        }
        return <GridBodyCell {...cellProps}></GridBodyCell>
    }
    renderColumn(col,index){
        const {row,grid} = this.props;
        const cellCls = classHelper.classNames('datagrid-td', this.getCellClass(col,row), {
            'datagrid-row-over': grid.isHighlighted(row,col),
            'datagrid-row-selected': grid.isSelected(row,col)
        });
        return (
            <td key={index}
                className={cellCls}
                style={this.getCellStyle(col,row)}
                onMouseEnter={()=>this.handleCellMouseEnter({row:row,column:col})}
                onMouseLeave={this.handleCellMouseLeave.bind(this)}
                onClick={(event)=>this.handleCellClick(row,col,event)}
                onDoubleClick={(event)=>this.handleCellDblClick(row,col,event)}
                onContextMenu={(event)=>this.handleCellContextMenu(row,col,event)}
            >
            {
                this.renderCell(col,index)
            }
            </td>
        )

    }
    render(){
        const {row,rowIndex,columns,grid} = this.props;
        const rowCls = classHelper.classNames('datagrid-row', this.getRowClass(row), {
            'datagrid-row-over': grid.isHighlighted(row),
            'datagrid-row-selected': grid.isSelected(row),
            'datagrid-row-alt': grid.props.striped && rowIndex%2
        });
        return (
            <tr key={rowIndex} className={rowCls} style={this.getRowStyle(row)}
                onMouseEnter={()=>this.handleRowMouseEnter(row)}
                onMouseLeave={()=>this.handleRowMouseLeave()}
                onClick={(event)=>this.handleRowClick(row,event)}
                onDoubleClick={(event)=>this.handleRowDblClick(row,event)}
                onContextMenu={(event)=>this.handleRowContextMenu(row,event)}
            >
            {
                columns.map((col,index) => (
                    this.renderColumn(col,index)
                ))
            }
            </tr>
        )
    }
}
export default GridBodyRow


// WEBPACK FOOTER //
// ./src/components/gridbase/GridBodyRow.js