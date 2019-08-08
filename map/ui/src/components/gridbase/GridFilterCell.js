import React from 'react';
import LocaleBase from '../base/LocaleBase';
import Validation from '../form/Validation';
import TextBox from '../textbox/TextBox';
import GridFilterButton from './GridFilterButton';

class GridFilterCell extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            model: {}
        }
    }
    componentDidMount(){
        const {column} = this.props;
        this.updateModelValue(column.filterValue);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.filterRules !== this.props.filterRules){
            const {column} = this.props;
            column.updateFilterRule();
            this.updateModelValue(column.filterValue)
        }
        if (nextProps.column !== this.props.column){
            setTimeout(() => {
                this.updateModelValue(nextProps.column.filterValue)
            })
        }
    }
    isOnLeft() {
        const {column,grid} = this.props;
        const {filterOperators} = column.props;
        if (filterOperators && filterOperators.length){
            if (grid.props.filterBtnPosition === 'left'){
                return true;
            }
        }
        return false;
    }
    isOnRight() {
        const {column,grid} = this.props;
        const {filterOperators} = column.props;
        if (filterOperators && filterOperators.length){
            if (grid.props.filterBtnPosition === 'right'){
                return true;
            }
        }
        return false;
    }
    updateModelValue(value){
        this.setState({
            model: {[this.props.column.props.field]:value}
        })
    }
    handleChange(name,value){
        const {column} = this.props;
        column.filterValue = value;
        column.doFilter();
        this.updateModelValue(value);
    }
    handleSelectionChange(selection){
        const {column,grid} = this.props;
        if (!selection){
            return;
        }
        let value = selection.value;
        if (!value){
            column.filterOperator = null;
            column.filterValue = null;
            grid.removeFilterRule(column.props.field);
            this.updateModelValue(null);
            return;
        }
        if (value === 'nofilter'){
            column.filterOperator = null;
            column.filterValue = null;
            grid.removeFilterRule(column.props.field);
            grid.doFilter();
            this.updateModelValue(null);
        } else if (column.filterValue !== null && column.filterValue !== ''){
            column.filterOperator = value;
            grid.addFilterRule({
                field: column.props.field,
                op: value,
                value: column.filterValue
            });
            grid.doFilter();
            this.updateModelValue(column.filterValue);
        }
    }
    handleFocus(){
        this.props.onFocus();
    }
    render(){
        const {column,grid} = this.props;
        const buttonProps = (position) => {
            return {
                className: 'datagrid-filter-btn f-noshrink datagrid-filter-btn-'+position,
                column: column,
                value: column.filterOperator,
                grid: grid,
                onSelectionChange: this.handleSelectionChange.bind(this)
            }
        }
        const leftButton = !this.isOnLeft() ? null : <GridFilterButton {...buttonProps('left')}/>
        const rightButton = !this.isOnRight() ? null : <GridFilterButton {...buttonProps('right')}/>
        const defaultFilter = ({value}) => (
            <TextBox value={value}></TextBox>
        )
        const filterInput = (column.props.filter||defaultFilter)({column:column,value:column.filterValue});
        return (
            <div className="datagrid-filter-c f-row" onFocus={this.handleFocus.bind(this)}>
                {leftButton}
                <Validation 
                    model={this.state.model} 
                    fieldName={column.props.field} 
                    onChange={this.handleChange.bind(this)}
                >
                {
                    React.Children.only(React.cloneElement(filterInput, {
                        className: 'f-full'
                    }))
                }
                </Validation>
                {rightButton}
            </div>
        )
    }
}
export default GridFilterCell


// WEBPACK FOOTER //
// ./src/components/gridbase/GridFilterCell.js