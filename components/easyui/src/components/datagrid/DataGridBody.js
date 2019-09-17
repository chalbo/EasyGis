import React from 'react';
import domHelper from '../base/DomHelper';
import classHelper from '../base/ClassHelper';
import VirtualScroll from '../base/VirtualScroll';
import GridBody from '../gridbase/GridBody';
import DataGridTable from './DataGridTable';

class DataGridBody extends GridBody{
    constructor(props){
        super(props);
        this.state = {
            marginTop: 0
        };
    }
    scrollLeft(value){
        if (value === undefined){
            if (this.isVirtualScroll()){
                return this.vscroll.scrollLeft();
            } else {
                return super.scrollLeft();
            }
        } else {
            if (this.isVirtualScroll()){
                this.vscroll.scrollLeft(value);
            } else {
                super.scrollLeft(value);
            }
        }
    }
    scrollTop(value){
        if (value === undefined){
            if (this.isVirtualScroll()){
                return this.vscroll.relativeScrollTop();
            } else {
                return this.bodyRef.scrollTop;
            }
        } else {
            if (!this.isVirtualScroll()){
                this.setState({marginTop:-value});
                // this.bodyRef.scrollTop = value;
            }
        }
    }
    isVirtualScroll() {
        const {viewIndex,grid} = this.props;
        if (grid.props.virtualScroll && viewIndex === 2){
            return true;
        } else {
            return false;
        }
    }
    scrollbarWidth(){
        if (this.vscroll){
            return this.vscroll.scrollbarWidth();
        } else {
            return domHelper.outerWidth(this.bodyRef) - domHelper.outerWidth(this.innerRef);
        }
    }
    handleVirtualPageUpdate(rows){
        const {grid} = this.props;
        grid.updateFrozenView(this.vscroll ? this.vscroll.scrollTop() : 0, rows);
    }
    handleVirtualScroll(event){
        this.props.onBodyScroll(event);
    }
    handleVirtualPageChange(event){
        this.props.grid.handleVirtualPageChange(event);
    }
    renderItems(rows){
        return <DataGridTable {...this.props} rows={rows}></DataGridTable>
    }
    render(){
        const bodyCls = classHelper.classNames('datagrid-body f-full', {
            'datagrid-vbody f-column': this.isVirtualScroll()
        });
        const innerCls = classHelper.classNames('datagrid-body-inner', {
            'f-column f-full panel-noscroll': this.isVirtualScroll()
        });
        return (
            <div className={bodyCls} style={{marginTop:0}}
                onScroll={this.handleScroll.bind(this)}
                ref={el=>this.bodyRef=el}
            >
                <div className={innerCls} style={{marginTop:this.state.marginTop}}
                    ref={el=>this.innerRef=el}
                >
                {
                    this.isVirtualScroll()
                    ? 
                    <VirtualScroll {...this.props} 
                        data={this.props.grid.state.rows}
                        renderItems={this.renderItems.bind(this)} 
                        ref={ref=>this.vscroll=ref}
                        onUpdate={this.handleVirtualPageUpdate.bind(this)}
                        onBodyScroll={this.handleVirtualScroll.bind(this)}
                        onPageChange={this.handleVirtualPageChange.bind(this)}
                    />
                    : 
                    <DataGridTable {...this.props}></DataGridTable>
                }
                </div>
            </div>
        )
    }
}
export default DataGridBody


// WEBPACK FOOTER //
// ./src/components/datagrid/DataGridBody.js