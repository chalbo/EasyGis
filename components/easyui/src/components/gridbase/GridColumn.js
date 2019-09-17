import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';

class GridColumn extends LocaleBase{
    constructor(props){
        super(props);
        this.currOrder = null;
        this.filterOperator = 'contains';
        this.filterValue = null;
        this.isFiltering = false;
        this.state = {
            width: props.width
        }
    }
    componentDidMount(){
        this.props.onColumnAdd(this);
        this.updateFilterRule();
    }
    componentWillUnmount(){
        this.props.onColumnRemove(this)
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.width !== this.props.width){
            this.setState({width:nextProps.width})
        }
    }
    updateFilterRule(){
        const grid = this.props.grid;
        if (!grid.props.filterable){
            return;
        }
        let rule = grid.getFilterRule(this.props.field);
        if (rule){
            this.filterOperator = rule.op;
            this.filterValue = rule.value;
        } else {
            this.filterOperator = 'contains';
            this.filterValue = null;
        }
    }
    doFilter(){
        const {field,grid} = this.props;
        if (this.isFiltering){
            return;
        }
        this.isFiltering = true;
        setTimeout(() => {
            if (this.filterValue === '' || this.filterValue === null){
                // this.filterOperator = null;
                grid.removeFilterRule(field);
                grid.doFilter();
            } else if (this.filterOperator){
                grid.addFilterRule({
                    field: field,
                    op: this.filterOperator,
                    value: this.filterValue
                });
                grid.doFilter();
            }
            this.isFiltering = false;
        }, grid.props.filterDelay);
    }
    render(){
        return null;
    }
}
GridColumn.propTypes = {
    field: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    rowspan: PropTypes.number,
    colspan: PropTypes.number,
    sortable: PropTypes.bool,
    editable: PropTypes.bool,
    editRules: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    order: PropTypes.string,
    frozen: PropTypes.bool,
    align: PropTypes.string,
    halign: PropTypes.string,
    expander: PropTypes.bool,
    filterable: PropTypes.bool,
    filterOperators: PropTypes.array,
    cellCss: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.func
    ]),
    render: PropTypes.func,
    header: PropTypes.func,
    footer: PropTypes.func,
    sorter: PropTypes.func,
    editor: PropTypes.func,
    filter: PropTypes.func
}
GridColumn.defaultProps = {
    rowspan: 1,
    colspan: 1,
    sortable: false,
    editable: false,
    order: 'asc',
    frozen: false,
    expander: false,
    filterable: false,
    filterOperators: []

}
export default GridColumn


// WEBPACK FOOTER //
// ./src/components/gridbase/GridColumn.js