import React from 'react';
import PropTypes from 'prop-types';
import ComboBase from '../base/ComboBase';
import DataGrid from '../datagrid/DataGrid';

class ComboGrid extends ComboBase{
    constructor(props){
        super(props);
        this.mappingTexts = {};
        Object.assign(this.state, {
            selection: null,
            scrollPosition: 0
        })
    }
    componentDidMount(){
        super.componentDidMount();
        this.setValue(this.state.value);
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
    blur(){
        super.blur();
        this.setState({}, ()=>{
            this.fixValue();
        })
    }
    fixValue(){
        const {value} = this.state;
        const {multiple,limitToList,separator} = this.props;
        let text = this.state.text.trim();
        if (!text){
            this.setValue(null);
            this.setState({selection:null});
            return
        }
        if (multiple){
            let vv = [];
            let tt = text.split(separator).filter(t => t.trim() !== '');
            for(let val of (value||[])){
                let text = this.mappingTexts[val];
                if (tt.indexOf(text) !== -1){
                    vv.push(val);
                }
            }
            this.setValue(vv);
        } else {
            if (!limitToList){
                this.setValue(text);
                this.setState({selection:null})
            }
        }
        this.updateText();
    }
    openPanel(){
        super.openPanel();
        setTimeout(() => {
            this.grid.scrollTop(this.state.scrollPosition)
        })
    }
    closePanel(){
        if (!this.state.panelClosed){
            this.setState({scrollPosition:this.grid.scrollTop()})
        }
        super.closePanel();
    }
    doFilter(){

    }
    findRow(value) {
        for(let row of this.props.data){
            if (row[this.props.valueField] === value){
                return row;
            }
        }
        return null;
    }
    updateText(){
        const {value} = this.state;
        const {multiple,textField,separator} = this.props;
        if (this.state.value == null){
            this.mappingTexts = {};
            this.setState({selection:null,text:''})
        } else {
            let mt = {};
            let tt = [];
            let ss = [];
            if (multiple){
                for(let val of value){
                    let row = this.findRow(val);
                    if (row){
                        mt[val] = row[textField];
                        ss.push(row);
                    } else {
                        mt[val] = this.mappingTexts[val] || val;
                    }
                    tt.push(mt[val]);
                }
                this.setState({selection:ss})
            } else {
                let row = this.findRow(value);
                if (row){
                    mt[value] = row[textField];
                    ss.push(row);
                } else {
                    mt[value] = this.mappingTexts[value] || value;
                }
                tt.push(mt[value]);
                this.setState({selection:ss.length ? ss[0] : null})
            }
            this.mappingTexts = mt;
            this.setState({text:tt.join(separator)})
        }
    }
    handleSelectionChange(selection){
        const {valueField,multiple} = this.props;
        this.setState({selection:selection})
        if (multiple){
            this.setValue(selection.map(row=>row[valueField]))
        } else {
            this.setValue(selection[valueField])
            this.closePanel()
        }
    }
    renderContent(){
        const {multiple} = this.props;
        return (
            <DataGrid 
                ref={ref=>this.grid=ref}
                {...this.props} 
                className="f-full" 
                border={false}
                selectionMode={multiple?'multiple':'single'}
                selection={this.state.selection}
                onSelectionChange={this.handleSelectionChange.bind(this)}
            >
            {this.props.children}
            </DataGrid>
        )
    }
}
ComboGrid.propTypes = Object.assign({}, ComboBase.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),
    data: PropTypes.array
})
ComboGrid.defaultProps = Object.assign({}, ComboBase.defaultProps, {
    data: [],
    valueField: 'id',
    textField: 'text',
    limitToList: true,
    editable: false
})
export default ComboGrid


// WEBPACK FOOTER //
// ./src/components/combogrid/ComboGrid.js