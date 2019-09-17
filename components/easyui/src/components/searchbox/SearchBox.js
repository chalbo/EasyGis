import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import InputBase from '../base/InputBase';
import MenuButton from '../menubutton/MenuButton';
import { Menu, MenuItem } from '../menu';

class SearchBox extends InputBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            menuBtnText: null,
            menuBtnIcon: null,
            category: props.category
        })
    }
    componentDidMount(){
        super.componentDidMount();
        this.setCategory(this.state.category)
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.category !== this.props.category){
            this.setCategory(nextProps.category)
        }
    }
    findItem(value){
        const {categories} = this.props;
        const cc = categories.filter(item => item.value===value);
        return cc.length ? cc[0] : null;
    }
    setCategory(value){
        const {categories} = this.props;
        if (!categories.length){
            return;
        }
        let item = this.findItem(value);
        if (!item){
            item = categories[0];
        }
        this.setState({
            menuBtnText: item.text,
            menuBtnIcon: item.iconCls,
            category: item.value || item.text
        })
    }
    doSearch(){
        const {disabled,readonly} = this.props;
        if (disabled || readonly){
            return;
        }
        this.props.onSearch({
            value: this.state.value,
            category: this.state.category
        })
    }
    handleIconClick(){
        this.doSearch();
    }
    handleKeyDown(event){
        if (event.which === 13){
            event.stopPropagation();
            event.preventDefault();
            this.doSearch();
        }
    }
    handleMenuItemClick(value){
        const {disabled,readonly} = this.props;
        if (!disabled && !readonly){
            this.setCategory(value);
        }
    }
    baseClasses(){
        return super.baseClasses() + ' searchbox';
    }
    renderInput(){
        return React.cloneElement(super.renderInput(), {
            onKeyDown: this.handleKeyDown.bind(this)
        })
    }
    renderMenu(){
        const {menuAlign,categories} = this.props;
        if (!categories.length){
            return null;
        }
        const cls = classHelper.classNames('f-noshrink textbox-button textbox-button-' + menuAlign, {
            'f-order0': menuAlign==='left',
            'f-order7': menuAlign==='right'
        })
        const menu = () => {
            return (
                <Menu>
                {categories.map((item,index) => (
                    <MenuItem key={index} {...item}></MenuItem>
                ))}
                </Menu>
            )
        }
        return (
            <MenuButton
                key="mb"
                className={cls}
                menu={menu}
                disabled={this.props.disabled}
                text={this.state.menuBtnText}
                iconCls={this.state.menuBtnIcon}
                onMenuItemClick={this.handleMenuItemClick.bind(this)}
            />
        )
    }
    renderOthers(){
        const {buttonAlign,buttonIconCls} = this.props;
        const buttonCls = classHelper.classNames(['textbox-addon f-column f-noshrink', {
            'f-order0': buttonAlign==='left',
            'f-order6': buttonAlign==='right'
        }]);
        const iconCls = 'textbox-icon f-full '+buttonIconCls;
        return [
            this.renderMenu(),
            <span key="btn" className={buttonCls}>
                <span className={iconCls} onClick={this.handleIconClick.bind(this)}></span>
            </span>
        ]
    }
}
SearchBox.propTypes = Object.assign({}, InputBase.propTypes, {
    menuAlign: PropTypes.string,
    categories: PropTypes.array,
    category: PropTypes.string,
    buttonAlign: PropTypes.string,
    buttonIconCls: PropTypes.string,
    onSearch: PropTypes.func
})
SearchBox.defaultProps = Object.assign({}, InputBase.defaultProps, {
    menuAlign: 'left',
    buttonAlign: 'right',
    buttonIconCls: 'icon-search',
    categories: [],
    onSearch({value,category}){}
})
export default SearchBox


// WEBPACK FOOTER //
// ./src/components/searchbox/SearchBox.js