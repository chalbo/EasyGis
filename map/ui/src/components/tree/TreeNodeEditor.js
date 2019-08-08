import React from 'react';
import LocaleBase from '../base/LocaleBase';
import domHelper from '../base/DomHelper';
import TextBox from '../textbox/TextBox';
import Validation from '../form/Validation';

class TreeNodeEditor extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            width: 50,
            error: null
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    componentDidMount(){
        this.autoSizeInput();
        const input = this.getInput();
        input.focus();
        domHelper.bind(input, 'keydown', this.handleKeyDown)
    }
    componentWillUnmount(){
        domHelper.unbind(this.getInput(), 'keydown', this.handleKeyDown);
    }
    getInput(){
        return this.el ? this.el.querySelector('.textbox-text') : null;
    }
    handleKeyDown(event){
        const {tree} = this.props;
        if (event.keyCode === 13){   // enter
            tree.endEdit();
        } else if (event.keyCode === 27){    // esc
            tree.cancelEdit();
        }
        setTimeout(() => this.autoSizeInput())
    }
    autoSizeInput() {
        const input = this.getInput();
        if (!input){
            return;
        }
        let style = getComputedStyle(input);
        let tmp = document.createElement('span');
        Object.assign(tmp.style, {
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            whiteSpace: 'nowrap'
        });
        tmp.innerHTML = input.value;
        document.body.appendChild(tmp);

        let getWidth = (val) => {
            val = val || '';
            var s = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tmp.innerHTML = s;
            return domHelper.outerWidth(tmp);
        };
        let width = getWidth(input.value);
        document.body.removeChild(tmp);
        this.setState({width:width+50})
    }
    render(){
        const {node,editor,editRules} = this.props;
        const field = 'text';
        const defaultEditor = ({node}) => (
            <TextBox value={node[field]}></TextBox>
        )
        const handleChange = (name,value) => {
            node[field] = value;
        }
        const handleValidate = (errors) => {
            let error = errors[field];
            this.setState({error:error?error[0]:null});
        }
        let rules = {};
        rules[field] = editRules;
        return (
            <span 
                className="tree-title tree-editing f-inline-row" 
                style={{width:this.state.width}}
                ref={el=>this.el=el}
            >
                <Validation 
                    model={node} 
                    rules={rules}
                    fieldName={field}
                    onChange={handleChange}
                    onValidate={handleValidate}
                >
                    {(editor||defaultEditor)({node:node,error:this.state.error})}
                </Validation>
            </span>
        )
    }
}
export default TreeNodeEditor


// WEBPACK FOOTER //
// ./src/components/tree/TreeNodeEditor.js