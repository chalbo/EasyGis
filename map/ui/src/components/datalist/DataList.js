import React from 'react';
import PropTypes from 'prop-types';
import ListBase from '../base/ListBase';
import classHelper from '../base/ClassHelper';
import domHelper from '../base/DomHelper';
import VirtualScroll from '../base/VirtualScroll';
import { Pagination } from '../pagination';

class DataList extends ListBase{
    setData(value){
        super.setData(value);
        if (!this.shouldSetScroll){
            this.setState({}, ()=>{
                this.scrollTop(this.props.scrollPosition);
                this.shouldSetScroll = true;
            })
        }
    }
    container(){
        return this.vscrollRef ? this.vscrollRef.bodyRef : this.innerRef;
    }
    scrollTop(value){
        if (value !== undefined){
            if (this.vscrollRef){
                this.vscrollRef.scrollState(value);
            } else {
                this.innerRef.scrollTop = value;
            }
        } else {
            if (this.vscrollRef){
                return this.vscrollRef.scrollState();
            } else {
                return this.innerRef.scrollTop;
            }
        }
    }
    highlightFirstRow() {
        const {rows} = this.state;
        this.setState({highlightRow:rows.length ? rows[0] : null}, ()=>{
            this.navRow(0);
        })
    }
    scrollToSelectedRow(){
        let container = this.vscrollRef ? this.vscrollRef.bodyRef : this.innerRef;
        let item = container.querySelector('.'+this.props.selectedCls);
        if (item){
            domHelper.scrollTo(container, item);
        }
    }
    navRow(step){
        const {rows,highlightRow} = this.state;
        super.navRow(step);
        this.setState({}, ()=>{
            let index = rows.indexOf(highlightRow);
            if (index >= 0){
                let container = this.vscrollRef ? this.vscrollRef.bodyRef : this.innerRef;
                let item = container.querySelector('.'+this.props.hoverCls);
                if (item){
                    domHelper.scrollTo(container, item);
                }
            }
        })
    }
    getItemClass(row){
        const {highlightRow} = this.state;
        const {itemCls,hoverCls,selectedCls} = this.props;
        let cc = [];
        if (itemCls){
            cc.push(itemCls);
        }
        if (hoverCls && highlightRow === row){
            cc.push(hoverCls);
        }
        if (selectedCls && this.isSelected(row)){
            cc.push(selectedCls);
        }
        return cc.length ? cc.join(' ') : null;    
    }
    innerClasses() {
        return classHelper.classNames(['f-full', {
            'f-column': this.props.virtualScroll
        }]);
    }
    innerStyle() {
        return {overflow: this.props.virtualScroll ? 'hidden' : 'auto'};
    }
    virtualItemStyle() {
        const {itemStyle,rowHeight} = this.props;
        return Object.assign({}, itemStyle, {height:rowHeight+'px'});
    }
    getRowIndex(index){
        if (this.vscrollRef){
            return index;
        } else if (this.props.pagination){
            return index + (this.state.pageNumber - 1) * this.state.pageSize;
        } else {
            return index;
        }
    }
    handleMouseEnter(row){
        return ()=>{
            this.setState({highlightRow: row})
        }
    }
    handleMouseLeave(){
        this.setState({highlightRow:null})
    }
    handleRowClick(row){
        return ()=>{
            super.handleRowClick(row)
        }
    }
    handleScroll(event){
        event.scrollTop = this.innerRef.scrollTop;
        event.scrollHeight = this.innerRef.scrollHeight;
        event.offsetHeight = this.innerRef.offsetHeight;
        this.props.onListScroll(event);
    }
    renderList(){
        const {virtualScroll} = this.props;
        if (virtualScroll){
            return null;
        }
        return this.state.rows.map((row,index) => {
            return (
                <div 
                    key={index} 
                    className={this.getItemClass(row)} 
                    style={this.props.itemStyle}
                    onMouseEnter={this.handleMouseEnter(row)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                    onClick={this.handleRowClick(row)}
                >
                {
                    this.props.renderItem({row:row,rowIndex:this.getRowIndex(index)})
                }
                </div>
            )
        })
    }
    renderVirtualList(){
        const {virtualScroll} = this.props;
        if (!virtualScroll){
            return null;
        }
        const {rowHeight,lazy,scrollPosition} = this.props;
        const {rows,total,pageNumber,pageSize} = this.state;
        const renderRow = (row,index) => {
            return (
                <div
                    key={index}
                    className={this.getItemClass(row)}
                    style={this.virtualItemStyle()}
                    onMouseEnter={this.handleMouseEnter(row)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                    onClick={this.handleRowClick(row)}
                >
                {this.props.renderItem({row:row,rowIndex:this.getRowIndex(index)})}
                </div>
            )
        }
        return (
            <VirtualScroll
                className="f-full"
                data={rows}
                total={total}
                pageNumber={pageNumber}
                pageSize={pageSize}
                rowHeight={rowHeight}
                lazy={lazy}
                scrollPosition1={scrollPosition}
                renderItem={renderRow}
                ref={ref=>this.vscrollRef=ref}
                onPageChange={this.handleVirtualPageChange.bind(this)}
            />
        )
    }
    renderPagination(position){
        const {pagination,pagePosition,loading,pageOptions} = this.props;
        const {total,pageNumber,pageSize} = this.state;
        if (!pagination){
            return null;
        }
        if (pagePosition !== 'both' && pagePosition !== position){
            return null;
        }
        const cls = 'datagrid-pager f-noshrink' + (pagePosition==='top' ? ' datagrid-pager-top' : '');
        return (
            <Pagination
                className={cls}
                {...pageOptions}
                total={total}
                pageNumber={pageNumber}
                pageSize={pageSize}
                loading={loading}
                onPageChange={this.handlePageChange.bind(this)}
            />
        )
    }
    renderLoading(){
        const {loading, defaultLoadMsg} = this.props;
        const loadMsg = this.t('ListBase.loadMsg', defaultLoadMsg);
        if (!loading){
            return null;
        }
        return (
            <div className="datagrid-loading f-row">
                <div className="datagrid-mask"></div>
                <div className="datagrid-mask-msg">{loadMsg}</div>
            </div>
        )
    }
    render(){
        const {border,className} = this.props;
        const cls = classHelper.classNames('f-column', className);
        const bodyCls = classHelper.classNames('panel-body panel-body-noheader datagrid f-full f-column', {
            'panel-body-noborder': !border
        });
        return (
            <div className={cls} style={this.props.style}>
                <div className={bodyCls}>
                    {this.renderPagination('top')}
                    <div className={this.innerClasses()} style={this.innerStyle()} ref={el=>this.innerRef=el} onScroll={this.handleScroll.bind(this)}>
                    {this.renderList()}
                    {this.renderVirtualList()}
                    </div>
                    {this.renderPagination('bottom')}
                </div>
                {this.renderLoading()}
            </div>
        )
    }
}
DataList.propTypes = Object.assign({}, ListBase.propTypes, {
    itemStyle: PropTypes.object,
    itemCls: PropTypes.string,
    hoverCls: PropTypes.string,
    selectedCls: PropTypes.string,
    scrollPosition: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object
    ]),
    renderItem: PropTypes.func,
    onListScroll: PropTypes.func
})
DataList.defaultProps = Object.assign({}, ListBase.defaultProps, {
    hoverCls: 'datagrid-row-over',
    selectedCls: 'datagrid-row-selected',
    onListScroll(event){}
})
export default DataList


// WEBPACK FOOTER //
// ./src/components/datalist/DataList.js