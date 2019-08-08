import React from 'react';
import LocaleBase from '../base/LocaleBase';
import GridFilterCell from './GridFilterCell';

class GridFilterRow extends LocaleBase{
    render(){
        const {grid} = this.props;
        return (
            <tr className="datagrid-header-row datagrid-filter-row">
            {
                this.props.columns.map((col,index) => (
                    <td key={index}>
                        <GridFilterCell column={col} filterRules={grid.props.filterRules} grid={grid} onFocus={()=>this.props.onFilterCellFocus(col)}></GridFilterCell>
                    </td>
                ))
            }
            </tr>
        )
    }
}
export default GridFilterRow


// WEBPACK FOOTER //
// ./src/components/gridbase/GridFilterRow.js