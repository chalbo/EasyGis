import React from 'react';
import LocaleBase from '../base/LocaleBase';
import { Accordion, AccordionPanel } from '../accordion';
import { Tree } from '../tree';

class SideMenuItems extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            innerData: props.data
        }
    }
    componentWillMount(){
        this.setData(this.props.data)
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.data !== this.props.data){
            this.setData(nextProps.data);
        }
    }
    setData(value){
        if (this.props.tip){
            let v = Object.assign({}, value);
            v.state = 'open';
            this.setState({innerData:[v]})
        } else {
            this.setState({innerData:value})
        }
    }
    handleNodeClick(node){
        if (node.children){
            node.state = node.state==='closed' ? 'open' : 'closed';
            if (node.state === 'open'){
                node.nodeCls = 'tree-node-nonleaf';
            } else {
                node.nodeCls = 'tree-node-nonleaf tree-node-nonleaf-collapsed';
            }
        } else {
            this.props.onItemClick(node);
        }
        this.setState({_:new Date()});
    }
    handleSelectionChange(selection){
        this.props.onSelectionChange(selection);
    }
    handlePanelSelect(panel){
        let index = this.accordion.getPanelIndex(panel);
        if (index >= 0){
            this.props.data[index].state = 'open';
        }
    }
    handlePanelUnselect(panel){
        let index = this.accordion.getPanelIndex(panel);
        if (index >= 0){
            this.props.data[index].state = 'closed';
        }
    }
    render(){
        const {border,animate,multiple} = this.props;
        return (
            <div className="sidemenu f-column f-full" style={{width:this.props.width}}>
                <Accordion className="f-full"
                    border={border}
                    animate={animate}
                    multiple={multiple}
                    ref={ref=>this.accordion=ref}
                    onPanelSelect={this.handlePanelSelect.bind(this)}
                    onPanelUnselect={this.handlePanelUnselect.bind(this)}
                >
                {
                    this.state.innerData.map((menu,index) => (
                        <AccordionPanel
                            key={index}
                            title={menu.text}
                            iconCls={this.props.tip?null:menu.iconCls}
                            collapsed={menu.state==='closed'}
                        >
                            <Tree
                                data={menu.children}
                                animate={animate}
                                selection={this.props.selection}
                                selectLeafOnly
                                onNodeClick={this.handleNodeClick.bind(this)}
                                onSelectionChange={this.handleSelectionChange.bind(this)}
                            />
                        </AccordionPanel>
                    ))
                }
                </Accordion>
            </div>
        )
    }
}
export default SideMenuItems


// WEBPACK FOOTER //
// ./src/components/sidemenu/SideMenuItems.js