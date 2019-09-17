import React from 'react';
import LocaleBase from '../base/LocaleBase';
import GridFooterCell from './GridFooterCell';

class GridFooter extends LocaleBase{
    scrollLeft(value){
        if (value === undefined){
            return this.footerRef.scrollLeft;
        } else {
            this.footerRef.scrollLeft = value;
        }
    }
    render(){
        const {columns,rows,paddingWidth} = this.props;
        return (
            <div className="datagrid-footer f-row f-noshrink">
                <div ref={el=>this.footerRef=el} className="datagrid-footer-inner f-full">
                    <table className="datagrid-ftable" border="0" cellSpacing="0" cellPadding="0">
                        <colgroup>
                            {
                                columns.map((col,index) => {
                                    return <col key={index} style={{width:col.state.width}}></col>
                                })
                            }
                        </colgroup>
                        <tbody>
                            {
                                rows.map((row,rowIndex) => (
                                    <tr key={rowIndex} className="datagrid-row">
                                    {
                                        columns.map((column,index) => (
                                            <td key={index}>
                                                <GridFooterCell row={row} column={column} rowIndex={rowIndex}></GridFooterCell>
                                            </td>
                                        ))
                                    }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {
                    paddingWidth>0 && <div className="datagrid-header f-noshrink" style={{width:paddingWidth+'px'}}></div>
                }
            </div>
        )
    }
}
export default GridFooter


// WEBPACK FOOTER //
// ./src/components/gridbase/GridFooter.js