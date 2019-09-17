import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';

class GridColumnGroup extends LocaleBase{
    constructor(props){
        super(props);
        this.rows = [];
    }
    componentDidMount(){
        this.props.onColumnGroupAdd(this)
    }
    componentWillUnmount(){
        this.props.onColumnGroupRemove(this)
    }
    onRowAdd(row){
        this.rows.push(row);
    }
    onRowRemove(row){
        let index = this.rows.indexOf(row);
        if (index >= 0){
            this.rows.splice(index,1);
        }
    }
    render(){
        return (
            <div>
                {
                    React.Children.map(this.props.children, child => {
                        return React.cloneElement(child, {
                            grid: this.props.grid,
                            onRowAdd: this.onRowAdd.bind(this),
                            onRowRemove: this.onRowRemove.bind(this)
                        })
                    })
                }
            </div>
        )
    }
}
GridColumnGroup.propTypes = {
    frozen: PropTypes.bool,
    align: PropTypes.string,
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ])
}
GridColumnGroup.defaultProps = {
    frozen: false,
    align: 'left'
}
export default GridColumnGroup



// WEBPACK FOOTER //
// ./src/components/gridbase/GridColumnGroup.js