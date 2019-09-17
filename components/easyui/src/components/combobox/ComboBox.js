import React from 'react';
import PropTypes from 'prop-types';
import ComboBase from '../base/ComboBase';
import DataList from '../datalist/DataList';

class ComboBox extends ComboBase{
    constructor(props){
        super(props);
        this.innerData = [];
        this.previousText = null;
        this.mappingTexts = {};
        this.timer = null;
        this.lastFilterValue = null;
        Object.assign(this.state, {
            items: [],
            selection: null,
            scrollPosition: null
        })
    }
    componentWillReceiveProps(nextProps){
        if (this.props.data !== nextProps.data){
            this.setData(nextProps.data);
        }
        if (this.props.value !== nextProps.value){
            this.setValue(nextProps.value)
        }
    }
    componentDidMount(){
        super.componentDidMount();
        this.setData(this.props.data);
        this.setValue(this.state.value);
    }
    text(){
        const {text,focused} = this.state;
        if (!focused){
            return this.props.textFormatter(text);
        }
        return text;
    }
    setValue(value){
        value = this.initValue(value);
        super.setValue(value);
        this.setState({}, ()=>{
            this.updateText(true);
        });
    }
    initValue(value){
        const {valueField,textField} = this.props;
        if (value == null){
            return value;
        }
        if (value instanceof Array){
            let vv = value.map(val => {
                return this.initValue(val);
            });
            value.splice(0,value.length);
            vv.forEach(v => value.push(v));
            return value;
        }
        if (typeof value === 'object'){
            this.mappingTexts[value[valueField]] = value[textField];
            return value[valueField];
        } else {
            return value;
        }
    }
    setData(value){
        if (value == null){
            value = [];
        }
        this.innerData = value;
        this.setState({items:this.innerData}, ()=>{
            this.updateText();
        })
    }
    openPanel(){
        super.openPanel();
        if (this.props.editable && !this.state.focused){
            this.setState({}, ()=>{
                this.doFilter('');
            })
        }
        setTimeout(() => {
            this.datalist.scrollToSelectedRow();
        })
    }
    closePanel(){
        if (!this.state.panelClosed){
            this.setState({scrollPosition:this.datalist.scrollTop()})
        }
        super.closePanel();
    }
    focus(){
        super.focus();
        this.previousText = this.state.text;
    }
    blur(){
        super.blur();
        this.setState({}, ()=>{
            this.fixValue();
        })
    }
    fixValue() {
        const {value} = this.state;
        const {multiple,limitToList,separator} = this.props;
        if (this.previousText === this.state.text){
            return;
        }
        let text = this.state.text.trim();
        if (!text){
            this.setValue(null);
            this.clearSelections();
            return;
        }
        if (multiple){
            let vv = [];
            let used = [];
            let tt = text.split(separator).filter(t => t.trim() !== '');
            for(let val of (value||[])){
                let text = this.mappingTexts[val];
                if (tt.indexOf(text) !== -1){
                    vv.push(val);
                    used.push(text);
                }
            }
            if (!limitToList){
                tt = tt.filter(t => used.indexOf(t) === -1);
                if (tt.length){
                    vv = vv.concat(tt);
                }
            }
            if ((value || []).join('') !== vv.join('')){
                this.setValue(vv);
            }
        } else {
            if (!limitToList){
                this.clearSelections();
                this.setValue(text);
            }
        }
        this.previousText = null;
        this.updateText();	
    }
    updateText(forceUpdate) {
        const {value} = this.state;
        const {multiple,valueField,textField,separator} = this.props;
        if (this.state.focused && !forceUpdate){
            return;
        }
        if (value == null) {
            if (this.datalist) {
                this.mappingTexts = {};
            }
            this.updateSelection(null);
            this.setState({text:''})
        } else {
            let mt = {};
            let tt = [];
            if (multiple){
                let rows = [];
                for(let i=0; i<value.length; i++){
                    let val = value[i];
                    let item = this.findItem(val);
                    if (item){
                        mt[val] = item[textField];
                        rows.push(item);
                    } else {
                        mt[val] = this.mappingTexts[val] || val;
                        let row = {};
                        row[valueField] = val;
                        row[textField] = mt[val];
                        rows.push(row);
                    }
                    tt.push(mt[val]);
                }
                this.updateSelection(rows);
            } else {
                let item = this.findItem(value);
                if (item){
                    mt[value] = item[textField];
                    this.updateSelection(item);
                } else {
                    mt[value] = this.mappingTexts[value] || value;
                    let row = {};
                    row[valueField] = value;
                    row[textField] = mt[value];
                    this.updateSelection(row);
                }
                tt.push(mt[value]);
            }
            this.mappingTexts = mt;
            this.setState({text:tt.join(separator)})
        }
    }
    findItem(value) {
        const {selection} = this.state;
        const {valueField} = this.props;
        const finder = (value, items = null) => {
            if (!items){
                items = this.innerData || [];
            }
            for(let item of items){
                if (item[valueField] === value){
                    return item;
                }
            }
            return null;
        };

        let item = finder(value);
        if (!item && selection){
            let items = selection instanceof Array ? selection : [selection];
            item = finder(value, items);
        }
        return item;
    }
    updateSelection(rows) {
        const {selection} = this.state;
        const {multiple} = this.props;
        if (!rows){
            rows = [];
        } else {
            rows = rows instanceof Array ? rows : [rows];
        }

        let items = [];
        if (selection){
            items = selection instanceof Array ? selection : [selection];
        }
        if (multiple){
            this.setState({selection:rows})
        } else {
            this.setState({selection:rows[0] || null})
        }
        if (items.length !== rows.length){
            this.setState({}, ()=>{
                this.props.onSelectionChange(this.state.selection);
            })
        }
    }
    clearSelections() {
        const {selection} = this.state;
        const {multiple} = this.props;
        if (selection){
            if (multiple){
                if (selection.length){
                    this.setState({selection:[]}, ()=>{
                        this.props.onSelectionChange([])
                    })
                }
            } else {
                this.setState({selection:null}, ()=>{
                    this.props.onSelectionChange(null)
                })
            }
        }
    }
    doFilter(value) {
        const {lazy,multiple,separator} = this.props;
        if (this.lastFilterValue === value){
            return;
        }
        value = (value||'').trim();
        if (!lazy){
            if (value){
                let val = value;
                if (multiple){
                    let tt = value.split(separator);
                    val = tt[tt.length - 1] || '';
                }
                let items = this.innerData.filter(item => {
                    return this.props.filter.call(this, val.trim(), item)
                });
                this.setState({items:items});
            } else {
                this.setState({items:this.innerData});
            }
            this.setState({}, ()=>{
                this.datalist.highlightFirstRow();
            });
        }
        this.lastFilterValue = value;
        this.datalist.container().scrollTop = 0;
        this.setState({scrollPosition:null}, ()=>{
            this.props.onFilterChange({
                pageNumber: 1,
                pageSize: this.props.pageSize,
                filterValue: value
            });
        });
    }
    handleKeyDown(event){
        if (this.state.panelClosed && event.which === 40){
            this.openPanel();
            event.preventDefault();
            return;
        }
        if (!this.datalist){
            return;
        }
        switch(event.which){
            case 40:	// down
                this.datalist.navRow(1);
                event.preventDefault();
                break;
            case 38:	// up
                this.datalist.navRow(-1);
                event.preventDefault();
                break;
            case 13:	// enter
                if (this.datalist){
                    this.datalist.doEnter();
                    if (!this.props.multiple){
                        setTimeout(() => this.closePanel());
                    }
                }
                event.preventDefault();
                break;
            case 9:		// tab
                this.fixValue();
                this.closePanel();
                break;
            case 27:	// escape
                this.closePanel();
                this.updateText();
                event.preventDefault();
                break;
            default:
        }
    }
    handleRowClick(row){
        if (!this.props.multiple){
            setTimeout(() => this.closePanel())
        }
    }
    handleSelectionChange(event){
        const {valueField,multiple} = this.props;
        this.props.onSelectionChange(event);
        if (event == null){
            this.setValue(null);
            this.setState({selection:null});
            return;
        }
        if (multiple){
            this.setValue(event.map(row => row[valueField]));
        } else {
            this.setValue(event[valueField]);
        }
        this.setState({selection:event});
    }
    handlePageChange(event){
        this.props.onFilterChange(Object.assign({}, event, {
            filterValue: this.lastFilterValue
        }))
    }
    renderInput(){
        return React.cloneElement(super.renderInput(), {
            onKeyDown: this.handleKeyDown.bind(this)
        })
    }
    renderItem({row}){
        const {textField} = this.props;
        return row[textField]
    }
    renderPanel(){
        const {valueField,multiple,panelStyle} = this.props;
        const {items,selection,panelClosed,panelLeft,panelTop,scrollPosition} = this.state;
        if (panelClosed){
            return null;
        }
        const style = Object.assign({}, panelStyle, {
            left: panelLeft+'px',
            top: panelTop+'px'
        })
        const total = this.props.total || items.length;
        return (
            <div key="panel" className="panel-body panel-body-noheader combo-panel combo-p f-row" style={style} ref={el=>this.panelRef=el}>
                <DataList {...this.props} className="f-full" style={{}}
                    itemCls="combobox-item" 
                    hoverCls="combobox-item-hover" 
                    selectedCls="combobox-item-selected"
                    border={false}
                    data={items}
                    total={total}
                    selectionMode={multiple ? 'multiple' : 'single'}
                    idField={valueField}
                    selection={selection}
                    scrollPosition={scrollPosition}
                    renderItem={this.renderItem.bind(this)}
                    ref={ref=>this.datalist=ref}
                    onRowClick={this.handleRowClick.bind(this)}
                    onSelectionChange={this.handleSelectionChange.bind(this)}
                    onPageChange={this.handlePageChange.bind(this)}
                />
            </div>
        )
    }

}
ComboBox.propTypes = Object.assign({}, ComboBase.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array,
        PropTypes.object
    ]),
    valueField: PropTypes.string,
    textField: PropTypes.string,
    groupField: PropTypes.string,
    limitToList: PropTypes.bool,
    lazy: PropTypes.bool,
    virtualScroll: PropTypes.bool,
    rowHeight: PropTypes.number,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    total: PropTypes.number,
    data: PropTypes.array,
    filter: PropTypes.func
})
ComboBox.defaultProps = Object.assign({}, ComboBase.defaultProps, {
    valueField: 'value',
    textField: 'text',
    limitToList: true,
    lazy: false,
    virtualScroll: false,
    rowHeight: 30,
    pageNumber: 1,
    pageSize: 10,
    total: 0,
    data: [],
    filter(q,item){
        const {textField} = this.props;
        let index = String(item[textField]).toLowerCase().indexOf(q.trim().toLowerCase());
        return index === -1 ? false : true;
    },
    onSelectionChange(selection){},
    onFilterChange({pageNumber,pageSize,filterValue}){}
})
export default ComboBox


// WEBPACK FOOTER //
// ./src/components/combobox/ComboBox.js