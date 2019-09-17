import React from 'react';
import SlideUpDown from '../base/SlideUpDown';
import LocaleBase from '../base/LocaleBase';
import TreeGridRow from './TreeGridRow';

class TreeGridChildren extends LocaleBase{
    renderChildren(row){
        const {grid,columns,depth} = this.props;
        const {animate} = grid.props;
        if (!row.children || !row.children.length){
            return null;
        }
        return (
            <tr key="children" className="treegrid-tr-tree">
                <td colSpan={columns.length} style={{border:0}}>
                    <SlideUpDown animate={animate} collapsed={row.state==='closed'}>
                        <div>
                            <TreeGridChildren {...this.props} grid={grid} rows={row.children} prow={row} columns={columns} depth={depth+1}></TreeGridChildren>
                        </div>
                    </SlideUpDown>
                </td>
            </tr>
        )
    }
    render(){
        const {grid,rows,columns,prow,depth} = this.props;
        return (
            <table className="datagrid-btable" border="0" cellSpacing="0" cellPadding="0">
                <colgroup>
                {
                    columns.map((col,index) => {
                        return <col key={index} style={{width:col.state.width}}></col>
                    })
                }
                </colgroup>
                <tbody>
                {
                    rows.map((row,index) => {
                        return [
                            <TreeGridRow {...this.props} key="row" grid={grid} row={row} rowIndex={index} prow={prow} columns={columns} depth={depth}></TreeGridRow>,
                            this.renderChildren(row)
                        ]
                    })
                }
                </tbody>
            </table>
        )
    }
}
TreeGridChildren.defaultProps = {
    rows: [],
    depth: 0
}
export default TreeGridChildren


// WEBPACK FOOTER //
// ./src/components/treegrid/TreeGridChildren.js