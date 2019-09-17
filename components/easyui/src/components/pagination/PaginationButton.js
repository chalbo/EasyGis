import LinkButton from '../linkbutton/LinkButton'

class PaginationButton extends LinkButton{
    btnIconCls() {
        const {name,loading} = this.props;
        let cls = 'l-btn-icon';
        if (name === 'refresh'){
            if (loading){
                cls += ' pagination-loading';
            } else {
                cls += ' pagination-load';
            }
        } else {
            cls += ' pagination-' + name;
        }
        return cls;
    }
    btnLeftCls() {
        return 'l-btn-left l-btn-icon-' + this.props.iconAlign;
    }
    isDisabled() {
        const {name,total,pageNumber,pageCount,disabled} = this.props;
        if (name === 'first' || name === 'prev'){
            return !total || pageNumber === 1;
        } else if (name === 'next' || name === 'last'){
            return pageNumber === pageCount;
        } else {
            return disabled;
        }
    }
    handleClick(event){
        event.stopPropagation();
        const {name,pageCount,pageNumber} = this.props;
        if (this.isDisabled()){
            event.preventDefault();
            return;
        }
        if (!this.props.href){
            event.preventDefault();
        }
        let page = -1;
        if (name === 'first'){
            page = 1;
        } else if (name === 'prev'){
            page = pageNumber - 1;
        } else if (name === 'next'){
            page = pageNumber + 1;
        } else if (name === 'last'){
            page = pageCount;
        } else if (name === 'refresh'){
            page = 0;
        }
        this.props.onButtonClick(page);
    }
}
PaginationButton.defaultProps = Object.assign({}, LinkButton.defaultProps, {
    plain: true
})
export default PaginationButton


// WEBPACK FOOTER //
// ./src/components/pagination/PaginationButton.js