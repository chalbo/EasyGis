import React from 'react';
import LocaleBase from '../base/LocaleBase';
import ComboBox from '../combobox/ComboBox';

class GridFilterButton extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }
    componentDidMount(){
        this.initData();
    }
    initData(){
        const {column,grid} = this.props;
        const {filterOperators} = column.props;
        if (filterOperators && filterOperators.length){
            let data = filterOperators.map(op => {
                return {
                    value: op,
                    text: grid.props.filterOperators[op].text
                };
            });
            this.setState({data:data})
        }
    }
    handleSelectionChange(selection){
        this.props.onSelectionChange(selection);
    }
    render(){
        return (
            <ComboBox {...this.props}
                arrowIconCls="icon-filter"
                panelStyle={{height:'auto',width:150}}
                inputStyle={{display:'none'}}
                editable={false}
                data={this.state.data}
                onSelectionChange={this.handleSelectionChange.bind(this)}
            />
        )
    }
}
export default GridFilterButton


// WEBPACK FOOTER //
// ./src/components/gridbase/GridFilterButton.js