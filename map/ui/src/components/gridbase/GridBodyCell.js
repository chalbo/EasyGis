import React from 'react';
import LocaleBase from '../base/LocaleBase';
import Validation  from '../form/Validation';
import TextBox from '../textbox/TextBox';

class GridBodyCell extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            error: null
        }
    }
    renderEditor(){
        const {row,column,rowIndex,grid} = this.props;
        const {editor,field,editRules} = column.props;
        const defaultEditor = ({row}) => (
            <TextBox
                name={field}
                value={row[field]}
                onChange={(value)=>row[field]=value}
            />
        )
        const handleChange = (name,value) => {
            // row[name] = value;
            row[field] = value;
        }
        const handleValidate = (errors) => {
            let error = errors[field];
            error = error?error[0]:null;
            this.setState({error:error});
            let editingItem = grid.state.editingItem;
            editingItem.errors = editingItem.errors || {};
            Object.assign(editingItem.errors, {[field]:errors[field]});
            grid.props.onEditValidate(editingItem);
        }
        let rules = {};
        rules[field] = editRules;
        return (
            <Validation 
                model={row} 
                rules={rules}
                fieldName={field}
                onChange={handleChange}
                onValidate={handleValidate}
            >
            {
                (editor||defaultEditor)({row:row,column:column,rowIndex:rowIndex,error:this.state.error})
            }
            </Validation>
        )
    }
    render(){
        const {row,column,rowIndex,isEditable} = this.props;
        const {align,field} = column.props;
        let cls = 'datagrid-cell';
        let cell = row[field];
        if (isEditable){
            cell = this.renderEditor();
            cls += ' datagrid-editable';
        } else if (column.props.render){
            cell = column.props.render({value:row[field],row:row,rowIndex:rowIndex})
        }
        return (
            <div className={cls} style={{textAlign:align}}>
            {cell}
            </div>
        )
    }
}
export default GridBodyCell


// WEBPACK FOOTER //
// ./src/components/gridbase/GridBodyCell.js