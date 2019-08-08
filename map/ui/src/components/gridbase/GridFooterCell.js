import React from 'react';
import LocaleBase from '../base/LocaleBase';

class GridFooterCell extends LocaleBase{
    render(){
        const {column,row,rowIndex} = this.props;
        const {footer,field} = column.props;
        let value = row[field];
        let cell = footer ? footer({row,value,rowIndex}) : value;
        return (
            <div className="datagrid-cell" style={{textAlign:column.props.align||null}}>
            {cell}
            </div>
        )
    }
}
export default GridFooterCell


// WEBPACK FOOTER //
// ./src/components/gridbase/GridFooterCell.js