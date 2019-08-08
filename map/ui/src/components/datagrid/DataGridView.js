import React from 'react';
import GridView from '../gridbase/GridView';
import GridHeader from '../gridbase/GridHeader';
import GridFooter from '../gridbase/GridFooter';
import DataGridBody from './DataGridBody';

class DataGridView extends GridView{
    render(){
        const {grid,columns,columnGroup,showHeader,showFooter} = this.props;
        const {headerPaddingWidth} = this.state;
        return (
            <div className={this.viewCls()} style={this.props.style}>
                {showHeader && <GridHeader
                    grid={grid}
                    columnGroup={columnGroup}
                    columns={columns}
                    paddingWidth={headerPaddingWidth}
                    ref={ref=>this.header=ref}
                    onCellClick={this.handleHeaderCellClick.bind(this)}
                />}
                <DataGridBody
                    {...this.props}
                    ref={ref=>this.body=ref}
                    onBodyScroll={this.handleBodyScroll.bind(this)}
                />
                {showFooter && <GridFooter
                    {...this.props}
                    rows={this.props.footerRows}
                    paddingWidth={headerPaddingWidth}
                    ref={ref=>this.footer=ref}
                />}
            </div>
        )
    }
}
export default DataGridView


// WEBPACK FOOTER //
// ./src/components/datagrid/DataGridView.js