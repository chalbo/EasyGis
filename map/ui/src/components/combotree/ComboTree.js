import React from 'react';
import PropTypes from 'prop-types';
import treeHelper from '../base/TreeHelper';
import ComboBase from '../base/ComboBase';
import Tree from '../tree/Tree';

class ComboTree extends ComboBase{
    constructor(props){
        super(props);
        this.mappingTexts = {};
        Object.assign(this.state, {
            selection: null
        })
    }
    componentDidMount(){
        super.componentDidMount();
        treeHelper.cascadeCheck = this.props.cascadeCheck;
        this.setValue(this.state.value);
    }
    isDiff(value1, value2){
        if (this.props.multiple && value1 != null && value2 != null){
            let s1 = Object.assign([],value1).sort().join(',');
            let s2 = Object.assign([],value2).sort().join(',');
            return s1 !== s2;
        } else {
            return value1 !== value2;
        }
    }
    setValue(value){
        value = this.initValue(value);
        value = this.initTreeValue(value);
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
    initTreeValue(value){
        const {valueField} = this.props;
        if (!this.props.multiple || value == null){
            return value;
        }
        treeHelper.uncheckAllNodes(this.props.data, ()=>{});
        for(let val of value){
            let node = treeHelper.findNode(this.props.data, valueField, val);
            if (node){
                treeHelper.checkNode(node, ()=>{})
            }
        }
        let vv = [];
        treeHelper.forNodes(this.props.data, (node) => {
            if (node.checkState === 'checked'){
                vv.push(node[valueField]);
            }
        })
        value.filter(val => vv.indexOf(val) === -1).forEach(val => {
            vv.push(val);
        });
        return vv;
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
            if (!multiple){
                this.setState({selection:null});
            }
            if (this.tree){
                this.tree.uncheckAllNodes();
            }
            return
        }
        if (multiple){
            let vv = [];
            let tt = text.split(separator).filter(t => t.trim() !== '');
            for(let val of value){
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
    }
    openPanel(){
        super.openPanel();
        if (this.props.editable){
            this.setState({}, ()=>this.doFilter(''))
        }
    }
    doFilter(value){
        const {multiple,separator} = this.props;
        if (value){
            if (multiple){
                let tt = value.trim().split(separator);
                let val = tt[tt.length-1];
                this.tree.doFilter(val);
            } else {
                this.tree.doFilter(value);
            }
        } else {
            this.tree.doFilter('')
        }
    }
    updateText(){
        const {value} = this.state;
        const {multiple,valueField,textField,separator} = this.props;
        if (value == null){
            this.mappingTexts = {};
            this.setState({text:''});
            if (!multiple){
                this.setState({selection:null})
            }
        } else {
            let mt = {};
            let tt = [];
            if (multiple){
                for(let val of value){
                    let node = treeHelper.findNode(this.props.data, valueField, val);
                    if (node){
                        mt[val] = node[textField];
                    } else {
                        mt[val] = this.mappingTexts[val] || val;
                    }
                    tt.push(mt[val]);
                }
            } else {
                let node = treeHelper.findNode(this.props.data, valueField, value);
                if (node){
                    mt[value] = node[textField];
                    this.setState({selection:node})
                } else {
                    mt[value] = this.mappingTexts[value] || value;
                }
                tt.push(mt[value]);
            }
            this.mappingTexts = mt;
            this.setState({text:tt.join(separator)})
        }
    }
    handleSelectionChange(node){
        const {valueField,multiple} = this.props;
        this.setState({selection:node})
        if (!multiple){
            this.setValue(node[valueField])
            this.closePanel()
        }
    }
    handleCheckChange(nodes){
        if (this.props.multiple){
            let vv = nodes.map(node => node[this.props.valueField]);
            this.setValue(vv)
        }
    }
    renderContent(){
        return (
            <Tree
                {...this.props}
                ref={ref=>this.tree=ref}
                checkbox={this.props.multiple}
                selection={this.state.selection}
                onSelectionChange={this.handleSelectionChange.bind(this)}
                onCheckChange={this.handleCheckChange.bind(this)}
            />
        )
    }
}
ComboTree.propTypes = Object.assign({}, ComboBase.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.array
    ]),
    data: PropTypes.array
})
ComboTree.defaultProps = Object.assign({}, ComboBase.defaultProps, {
    data: [],
    valueField: 'id',
    textField: 'text',
    limitToList: true,
    editable: false
})

export default ComboTree


// WEBPACK FOOTER //
// ./src/components/combotree/ComboTree.js