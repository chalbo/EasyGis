import PropTypes from 'prop-types';
import LocaleBase from './LocaleBase';
import DEFAULT_FILTER_OPERATORS from './FilterOperators';

class ListBase extends LocaleBase{
    constructor(props){
        super(props);
        this.innerData = [];
        this.filteredData = [];
        this.pageState = null;
        this.state = {
            total: props.total,
            pageNumber: props.pageNumber,
            pageSize: props.pageSize,
            rows: [],
            selectedRows: [],
            selectedCells: [],
            highlightRow: null,
            highlightCell: null
        }
    }
    componentWillReceiveProps(nextProps){
        if (this.props.total !== nextProps.total){
            this.setState({total:nextProps.total})
        }
        if (this.props.pageNumber !== nextProps.pageNumber){
            this.setState({pageNumber:nextProps.pageNumber})
        }
        if (this.props.pageSize !== nextProps.pageSize){
            this.setState({pageSize:nextProps.pageSize})
        }
        if (this.props.data !== nextProps.data){
            // this.setData(nextProps.data);
            this.setState({}, ()=>{
                this.setData(nextProps.data)
            })
        }
        if (this.props.selection !== nextProps.selection){
            this.setSelectionValue(nextProps.selection);
        }
    }
    componentDidMount(){
        this.setData(this.props.data);
        this.setSelectionValue(this.props.selection);
    }
    setData(value) {
        const {lazy,pagination} = this.props;
        const {total,pageNumber,pageSize} = this.state;
        if (value == null){
            value = [];
        }
        this.innerData = value;
        if (!lazy){
            this.sortData();
            this.filteredData = this.filterData(this.innerData);
        } else {
            this.filteredData = this.innerData;
        }
        this.setGroupData();
        if (pagination){
            if (lazy){
                if (this.filteredData.length){
                    this.setState({rows:this.filteredData.slice(0, pageSize)})
                } else {
                    if (total){
                        this.props.onPageChange({
                            pageNumber: pageNumber,
                            pageSize: pageSize
                        })
                    } else {
                        this.setState({rows:[]})
                    }
                }
            } else {
                let start = (pageNumber - 1) * pageSize;
                this.setState({
                    total: this.filteredData.length,
                    rows: this.filteredData.slice(start, start + pageSize)
                });
            }
        } else {
            this.setState({rows:this.filteredData})
        }
    }
    setGroupData(){

    }
    sortData(){

    }
    selectionValue() {
        const {selectionMode} = this.props;
        const {selectedRows,selectedCells} = this.state;
        if (selectionMode === 'single'){
            return selectedRows[0] || null;
        } else if (selectionMode === 'multiple'){
            return selectedRows;
        } else if (selectionMode === 'cell'){
            return selectedCells[0] || null;
        } else if (selectionMode === 'multicell'){
            return selectedCells;
        } else {
            return null;
        }
    }
    setSelectionValue(value){
        const {selectionMode} = this.props;
        if (value == null){
            this.setState({
                selectedRows:[],
                selectedCells:[]
            })
            return;
        }
        if (selectionMode === 'single'){
            this.setState({selectedRows:[value]})
        } else if (selectionMode === 'multiple'){
            this.setState({selectedRows:value})
        } else if (selectionMode === 'cell'){
            this.setState({selectedCells:[value]})
        } else if (selectionMode === 'multicell'){
            this.setState({selectedCells:value})
        }
    }
    filterData(data) {
        const {filterRules,filterOperators,filterMatchingType} = this.props;
        let isMatch = (row) => {
            let rules = filterRules;
            if (!rules.length){
                return true;
            }
            for(let i=0; i<rules.length; i++){
                let rule = rules[i];
                let source = row[rule.field];
                if (source == null){
                    source = '';
                }
                let op = filterOperators[rule.op];
                let matched = op.isMatch(source, rule.value);
                if (filterMatchingType === 'any'){
                    if (matched) {
                        return true;
                    }
                } else {
                    if (!matched){
                        return false;
                    }
                }
            }
            return filterMatchingType === 'all';
        };
        let rows = data.filter(row => isMatch(row));
        return rows;

    }
    doFilter(rule) {
        if (rule){
            if (rule.value === null || rule.value === ''){
                this.removeFilterRule(rule.field);
            } else {
                this.addFilterRule(rule);
            }
        }
        this.setData(this.props.data);
        this.props.onFilterChange(this.props.filterRules);
    }
    doEnter() {
        const {selectionMode} = this.props;
        const {highlightCell,highlightRow} = this.state;
        if (this.isCellSelectionMode()){
            if (highlightCell){
                if (selectionMode === 'cell'){
                    this.selectCell(highlightCell.row, highlightCell.column);
                } else if (selectionMode === 'multicell'){
                    if (this.isSelected(highlightCell.row, highlightCell.column)){
                        this.unselectCell(highlightCell.row, highlightCell.column);
                    } else {
                        this.selectCell(highlightCell.row, highlightCell.column);
                    }
                }
            }
        } else {
            if (highlightRow){
                if (selectionMode === 'single'){
                    this.selectRow(highlightRow);
                } else if (selectionMode === 'multiple'){
                    if (this.isSelected(highlightRow)){
                        this.unselectRow(highlightRow);
                    } else {
                        this.selectRow(highlightRow);
                    }
                }
            }
        }
    }
    getFilterRuleIndex(field) {
        const {filterRules} = this.props;
        for(let i=0; i<filterRules.length; i++){
            if (filterRules[i].field === field){
                return i;
            }
        }
        return -1;
    }
    getFilterRule(field) {
        const {filterRules} = this.props;
        let index = this.getFilterRuleIndex(field);
        if (index !== -1){
            return filterRules[index];
        } else {
            return null;
        }
    }
    addFilterRule(rule) {
        const {filterRules} = this.props;
        let index = this.getFilterRuleIndex(rule.field);
        if (index !== -1){
            Object.assign(filterRules[index], rule);
        } else {
            filterRules.push(rule);
        }
    }
    removeFilterRule(field) {
        const {filterRules} = this.props;
        let index = this.getFilterRuleIndex(field);
        if (index !== -1){
            filterRules.splice(index, 1);
        }
    }
    getSelectedIndex(row){
        const {idField} = this.props;
        const {selectedRows} = this.state;
        if (idField){
            for(let i=0; i<selectedRows.length; i++){
                if (selectedRows[i][idField] === row[idField]){
                    return i;
                }
            }
            return -1;
        } else {
            return selectedRows.indexOf(row);
        }
    }
    getSelectedCellIndex(row, column){
        const {idField} = this.props;
        const {selectedCells} = this.state;
        for(let i=0; i<selectedCells.length; i++){
            let cell = selectedCells[i];
            if (cell.column === column){
                if (idField){
                    if (cell.row[idField] === row[idField]){
                        return i;
                    }
                } else if (cell.row === row){
                    return i;
                }
            }
        }
        return -1;
    }
    isCellSelectionMode() {
        const {selectionMode} = this.props;
        if (selectionMode === 'cell' || selectionMode === 'multicell'){
            return true;
        } else {
            return false;
        }
    }
    isHighlighted(row, column = null) {
        const {highlightCell,highlightRow} = this.state;
        if (this.isCellSelectionMode()){
            if (highlightCell && highlightCell.row === row && highlightCell.column === column){
                return true;
            }
        } else if (highlightRow === row){
            return true;
        }
        return false;
    }
    isSelected(row, column = null){
        if (this.isCellSelectionMode()){
            let index = this.getSelectedCellIndex(row, column);
            return index !== -1;
        } else {
            let index = this.getSelectedIndex(row);
            return index !== -1;
        }
    }
    selectRow(row){
        const {selectionMode} = this.props;
        if (this.isCellSelectionMode()){
            return;
        }
        if (!this.isSelected(row)){
            const selection = this.selectionValue();
            if (selectionMode === 'single'){
                if (selection){
                    this.props.onRowUnselect(selection);
                }
                this.setState({selectedRows:[row]})
            } else if (selectionMode === 'multiple'){
                this.setState({selectedRows:[...this.state.selectedRows,row]})
            }
            this.setState({}, ()=>{
                this.props.onRowSelect(row);
                this.props.onSelectionChange(this.selectionValue());
            })
        }
    }
    unselectRow(row){
        if (this.isCellSelectionMode()){
            return;
        }
        let index = this.getSelectedIndex(row);
        if (index >= 0){
            const {selectedRows} = this.state;
            this.setState({
                selectedRows: selectedRows.filter((_,idx) => idx !== index)
            }, () => {
                this.props.onRowUnselect(row);
                this.props.onSelectionChange(this.selectionValue());
            })
        }
    }
    selectCell(row, column){
        const {selectionMode} = this.props;
        if (!this.isCellSelectionMode()){
            return;
        }
        if (!this.isSelected(row, column)){
            const selection = this.selectionValue();
            if (selectionMode === 'cell'){
                if (selection){
                    this.props.onCellUnselect(selection);
                }
                this.setState({selectedCells:[{row:row,column:column}]})
            } else if (selectionMode === 'multicell'){
                this.setState({selectedCells:[...this.state.selectedCells,{row:row,column:column}]})
            }
            this.setState({}, ()=>{
                this.props.onCellSelect({row:row,column:column});
                this.props.onSelectionChange(this.selectionValue());
            })
        }
    }
    unselectCell(row, column){
        if (!this.isCellSelectionMode()){
            return;
        }
        let index = this.getSelectedCellIndex(row, column);
        if (index >= 0){
            const {selectedCells} = this.state;
            this.setState({
                selectedCells: selectedCells.filter((_,idx) => idx !== index)
            }, ()=>{
                this.props.onCellUnselect({row:row,column:column});
                this.props.onSelectionChange(this.selectionValue());
            });
        }
    }
    clearSelections() {
        if (this.isCellSelectionMode()){
            const {selectedCells} = this.state;
            if (selectedCells.length){
                this.setState({selectedCells:[]}, ()=>{
                    this.props.onSelectionChange(this.selectionValue());
                });
            }
        } else {
            const {selectedRows} = this.state;
            if (selectedRows.length){
                this.setState({selectedRows:[]}, ()=>{
                    this.props.onSelectionChange(this.selectionValue());
                });
            }
        }
    }
    navRow(step) {
        const {rows,highlightRow} = this.state;
        if (!rows.length){
            return;
        }
        let index = rows.indexOf(highlightRow);
        if (index === -1){
            index = 0;
        } else {
            index += step;
            if (index >= rows.length){
                index = rows.length - 1;
            } else if (index < 0){
                index = 0;
            }
        }
        this.setState({highlightRow:rows[index]});
    }
    handlePageChange(event){
        const {lazy,filterRules} = this.props;
        const {pageNumber,pageSize,refresh} = event;
        if (this.pageState !== null && !refresh){
            if (this.pageState.pageNumber === event.pageNumber && this.pageState.pageSize === event.pageSize){
                return;
            }
        }
        this.pageState = event;
        this.setState({
            pageNumber: pageNumber,
            pageSize: pageSize
        })
        if (!lazy){
            let start = (pageNumber - 1) * pageSize;
            let rows = this.filteredData.slice(start, start + (+pageSize));
            this.setState({rows:rows})
        }
        this.props.onPageChange(Object.assign(event, {
            filterRules: filterRules
        }))
    }
    handleVirtualPageChange(event){
        const {filterRules} = this.props;
        this.setState({
            pageNumber: event.pageNumber,
            pageSize: event.pageSize
        })
        this.props.onPageChange(Object.assign(event, {
            filterRules: filterRules
        }))
    }
    handleRowClick(row){
        const {selectionMode} = this.props;
        this.props.onRowClick(row);
        if (selectionMode === 'single'){
            this.selectRow(row);
        } else if (selectionMode === 'multiple') {
            if (this.isSelected(row)){
                this.unselectRow(row);
            } else {
                this.selectRow(row);
            }
        }
    }
    handleCellClick(row, column){
        const {selectionMode} = this.props;
        this.props.onCellClick({row:row, column:column})
        if (selectionMode === 'cell'){
            this.selectCell(row, column);
        } else if (selectionMode === 'multicell'){
            if (this.isSelected(row, column)){
                this.unselectCell(row, column);
            } else {
                this.selectCell(row, column);
            }
        }
    }
    render(){
        return null;
    }
}
ListBase.propTypes = {
    border: PropTypes.bool,
    loading: PropTypes.bool,
    loadMsg: PropTypes.string,
    pagination: PropTypes.bool,
    pagePosition: PropTypes.string,
    pageOptions: PropTypes.object,
    lazy: PropTypes.bool,
    virtualScroll: PropTypes.bool,
    rowHeight: PropTypes.number,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    idField: PropTypes.string,
    selectionMode: PropTypes.string,
    selection: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    filterable: PropTypes.bool,
    filterRules: PropTypes.array,
    filterDelay: PropTypes.number,
    filterMatchingType: PropTypes.string,
    filterPosition: PropTypes.string,
    filterBtnPosition: PropTypes.string,
    filterOperators: PropTypes.object,
    data: PropTypes.array
}
ListBase.defaultProps = {
    border: true,
    loading: false,
    defaultLoadMsg: 'Processing, please wait ...',
    pagination: false,
    pagePosition: 'bottom',
    lazy: false,
    virtualScroll: false,
    rowHeight: 32,
    pageNumber: 1,
    pageSize: 10,
    total: 0,
    filterable: false,
    filterRules: [],
    filterDelay: 400,
    filterMatchingType: 'all',
    filterPosition: 'bottom',
    filterBtnPosition: 'right',
    filterOperators: DEFAULT_FILTER_OPERATORS,
    data: [],
    onPageChange(){},
    onFilterChange(){},
    onRowClick(row){},
    onRowDblClick(row){},
    onCellClick(){},
    onCellDblClick(){},
    onRowUnselect(){},
    onRowSelect(){},
    onCellUnselect(){},
    onCellSelect(){},
    onSelectionChange(){}
}
export default ListBase


// WEBPACK FOOTER //
// ./src/components/base/ListBase.js