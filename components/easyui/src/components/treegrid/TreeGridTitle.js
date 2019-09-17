import React from 'react';
import LocaleBase from '../base/LocaleBase';

class TreeGridTitle extends LocaleBase{
    render(){
        const {row,column} = this.props;
        let cell = row[column.props.field];
        if (column.props.render){
            cell = column.props.render({value:row[column.props.field],row:row})
        }
        return (
            <span className="tree-title">{cell}</span>
        )
    }
}
export default TreeGridTitle


// WEBPACK FOOTER //
// ./src/components/treegrid/TreeGridTitle.js