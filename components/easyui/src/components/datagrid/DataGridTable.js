import React from 'react';
import LocaleBase from '../base/LocaleBase';
import classHelper from '../base/ClassHelper';
import DataGridRow from './DataGridRow';

class DataGridTable extends LocaleBase{
    getRowIndex(rowIndex,row){
        const {grid} = this.props;
        if (grid.groupField){
            rowIndex = row._rowIndex;
        }
        return grid.getAbsoluteIndex(rowIndex);
    }
    handleGroupExpanderClick(value,event){
        const {grid} = this.props;
        event.stopPropagation();
        grid.toggleGroup(value);
    }
    handleDetailExpanderClick(row,event){
        const {grid} = this.props;
        event.stopPropagation();
        grid.toggleRow(row);
    }
    renderRowDetail(row,index){
        const {columns,grid} = this.props;
        const {renderDetail} = grid.props;
        if (!renderDetail){
            return null;
        }
        if (!grid.isRowExpanded(row)){
            return null;
        }
        return (
            <tr key={'detail'+index}>
                <td colSpan={columns.length}>
                    <div className="datagrid-row-detail">
                    {renderDetail({row:row,rowIndex:index})}
                    </div>
                </td>
            </tr>
        )
    }
    renderGroupRow(row,index){
        const {columns,grid} = this.props;
        if (!grid.isGroupRow(row)){
            return null;
        }
        const {renderGroup} = grid.props;
        const expanderCls = classHelper.classNames('datagrid-row-expander', {
            'datagrid-row-expand': row.collapsed,
            'datagrid-row-collapse': !row.collapsed
        })
        return (
            <tr key={'group'+index} className="datagrid-row datagrid-group-row">
                <td className="datagrid-td-group" colSpan={columns.length}>
                    <div className="datagrid-group f-row">
                        <span className="datagrid-group-expander f-row f-content-center f-noshrink" onClick={(event)=>this.handleGroupExpanderClick(row.value,event)} style={{width:grid.props.expanderWidth}}>
                            <span className={expanderCls}></span>
                        </span>
                        <div className="datagrid-group-title">
                        {renderGroup(row)}
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
    renderRow(row,rowIndex){
        const {grid} = this.props;
        if (grid.isGroupRow(row)){
            return null;
        }
        return (
            <DataGridRow 
                key={rowIndex} 
                {...this.props} 
                row={row} 
                rowIndex={rowIndex}
                onDetailExpanderClick={this.handleDetailExpanderClick.bind(this)}
            />
        )
    }
    render(){
        return (
            <table className="datagrid-btable" border="0" cellSpacing="0" cellPadding="0">
                <colgroup>
                {
                    this.props.columns.map((col,index) => {
                        return <col key={index} style={{width:col.state.width}}></col>
                    })
                }
                </colgroup>
                <tbody>
                {
                    this.props.rows.map((row,index) => {
                        index = this.getRowIndex(index);
                        return [
                            this.renderGroupRow(row,index),
                            this.renderRow(row,index),
                            this.renderRowDetail(row,index)
                        ]
                    })
                }
                </tbody>
            </table>
        )
    }
}
export default DataGridTable


// WEBPACK FOOTER //
// ./src/components/datagrid/DataGridTable.js