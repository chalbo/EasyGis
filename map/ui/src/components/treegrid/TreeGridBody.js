import React from 'react';
import GridBody from '../gridbase/GridBody';
import TreeGridChildren from './TreeGridChildren';

class TreeGridBody extends GridBody{
    render(){
        return (
            <div 
                className="datagrid-body f-full"
                onScroll={this.handleScroll.bind(this)}
                ref={el=>this.bodyRef=el}
            >
                <div className="datagrid-body-inner" ref={el=>this.innerRef=el}>
                    <TreeGridChildren {...this.props}></TreeGridChildren>
                </div>
            </div>
        )
    }
}
export default TreeGridBody


// WEBPACK FOOTER //
// ./src/components/treegrid/TreeGridBody.js