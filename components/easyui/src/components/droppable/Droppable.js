import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import DraggableClass from '../draggable/DraggableClass';
import DroppableClass from './DroppableClass';

class Droppable extends LocaleBase{
    componentDidMount(){
        while(!(this.el instanceof Element)){
            this.el = this.el.el;
        }
        this._dropInstance = new DroppableClass(this.el, this.props);
        DraggableClass.droppables.push(this._dropInstance);
    }
    componentWillUnmount(){
        let index = DraggableClass.droppables.indexOf(this._dropInstance);
		if (index >= 0){
            DraggableClass.droppables.splice(index, 1);
        }
        this._dropInstance = null;
    }
    componentWillReceiveProps(nextProps){
        this._dropInstance.updateOptions(nextProps);
    }
    render(){
        return React.cloneElement(React.Children.only(this.props.children), {ref:ref=>this.el=ref})
    }

}
Droppable.propTypes = {
    scope: PropTypes.string,
    disabled: PropTypes.bool
}
Droppable.defaultProps = {
    disabled: false,
    onDragEnter(scope){},
    onDragOver(scope){},
    onDragLeave(scope){},
    onDrop(scope){}
}
export default Droppable


// WEBPACK FOOTER //
// ./src/components/droppable/Droppable.js