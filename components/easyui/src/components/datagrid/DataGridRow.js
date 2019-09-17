import React from 'react';
import classHelper from '../base/ClassHelper';
import GridBodyRow from '../gridbase/GridBodyRow';

class DataGridRow extends GridBodyRow{
    handleDetailExpanderClick(event){
        const {row} = this.props;
        event.stopPropagation();
        this.props.onDetailExpanderClick(row,event);
    }
    renderColumn(col,index){
        const {row,grid} = this.props;
        if (!col.props.expander){
            return super.renderColumn(col,index)
        }
        let expanded = grid.isRowExpanded(row);
        let expanderCls = classHelper.classNames('datagrid-row-expander', {
            'datagrid-row-collapse': expanded,
            'datagrid-row-expand': !expanded
        })
        return (
            <td key={index} className="datagrid-td-expander">
                <div className="datagrid-cell f-row f-content-center">
                    <span className={expanderCls} onClick={this.handleDetailExpanderClick.bind(this)}></span>
                </div>
            </td>
        )
    }
}
export default DataGridRow


// WEBPACK FOOTER //
// ./src/components/datagrid/DataGridRow.js