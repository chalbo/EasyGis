import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import GridHeader from './GridHeader';
import GridBody from './GridBody';

class GridView extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            headerPaddingWidth: 0
        }
    }
    componentWillReceiveProps(nextProps){
        if (this.props.rows !== nextProps.rows){
            setTimeout(() => {
                this.setState({
                    headerPaddingWidth: this.getHeaderPaddingWidth()
                });
            })
        }
    }
    scrollTop(value){
        if (value === undefined){
            return this.body.scrollTop();
        } else {
            this.body.scrollTop(value);
        }
    }
    headerHeight(value){
        if (value === undefined){
            return this.header ? this.header.height() : 0;
        } else {
            if (this.header){
                this.header.height(value);
            }
        }
    }
    getHeaderPaddingWidth(){
        const {viewIndex} = this.props;
        if (viewIndex === 2){
            let width = this.body ? this.body.scrollbarWidth() : 0;
            if (width > 0){
                return width;
            }
        }
        return null;
    }
    viewCls(){
        const {viewIndex} = this.props;
        return 'f-column datagrid-view' + viewIndex + (viewIndex===2 ? ' f-full' : ' f-noshrink');
    }
    handleHeaderCellClick(event){
        const {grid} = this.props;
        const col = event.column;
        if (col.props.sortable){
            grid.addSort(col);
            setTimeout(() => {
                grid.setData(grid.innerData);
                if (this.body.vscroll){
                    this.body.vscroll.refresh();
                }
                grid.props.onSortChange(grid.state.sorts);

            })
        }
    }
    handleBodyScroll(event){
        if (this.header){
            this.header.scrollLeft(event.left);
        }
        if (this.footer){
            this.footer.scrollLeft(event.left);
        }
        this.props.onBodyScroll(event);
    }
    render(){
        const {columns,columnGroup} = this.props;
        const {headerPaddingWidth} = this.state;
        return (
            <div className={this.viewCls()}>
                <GridHeader
                    columnGroup={columnGroup}
                    columns={columns}
                    paddingWidth={headerPaddingWidth}
                    ref={ref=>this.header=ref}
                    onCellClick={this.handleHeaderCellClick.bind(this)}
                />
                <GridBody ref={ref=>this.body=ref}></GridBody>
            </div>
        )
    }
}
GridView.propTypes = {
    columns: PropTypes.array,
    columnGroup: PropTypes.object,
    viewIndex: PropTypes.number,
    rows: PropTypes.array,
    footerRows: PropTypes.array,
    filterable: PropTypes.bool,
    onBodyScroll: PropTypes.func
}
GridView.defaultProps = {
    columns: [],
    viewIndex: 2,
    rows: [],
    footerRows: [],
    filterable: false,
    onBodyScroll(){}
}
export default GridView


// WEBPACK FOOTER //
// ./src/components/gridbase/GridView.js