import React from 'react';
import LocaleBase from '../base/LocaleBase';

class TreeNodeTitle extends LocaleBase{
    render(){
        const {node,tree} = this.props;
        const {render} = tree.props;
        return(
            <span className="tree-title">
            {
                render ? render({node}) : node.text
            }
            </span>
        )
    }
}
export default TreeNodeTitle


// WEBPACK FOOTER //
// ./src/components/tree/TreeNodeTitle.js