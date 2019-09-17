import React from 'react';
import PropTypes from 'prop-types';
import LocaleBase from '../base/LocaleBase';
import MessagerDialog from './MessagerDialog';

class Messager extends LocaleBase{
    constructor(props){
        super(props);
        this.state = {
            closed: true,
            buttons: props.buttons
        }
    }
    alert(options){
        if (!options.buttons || !options.buttons.length){
            options.buttons = [{text: this.t('Messager.ok',this.props.defaultOk), value: true}];
        }
        this.openDialog(options, 'alert');
    }
    confirm(options){
        if (!options.icon){
			options.icon = 'question';
		}
		if (!options.buttons || !options.buttons.length){
			options.buttons = [
				{text: this.t('Messager.ok',this.props.defaultOk), value: true},
				{text: this.t('Messager.cancel',this.props.defaultCancel), value: false}
			];
		}
        this.openDialog(options, 'confirm');
    }
    prompt(options){
		if (!options.icon){
			options.icon = 'question';
		}
		if (!options.buttons || !options.buttons.length){
			options.buttons = [
				{text: this.t('Messager.ok',this.props.defaultOk), value: true},
				{text: this.t('Messager.cancel',this.props.defaultCancel), value: false}
			];
		}
        this.openDialog(options, 'prompt');
    }
    openDialog(options, type='alert'){
        options.messagerType = type;
        this.setState(options);
        this.dialog.open();
    }
    close(button){
        this.dialog.closeDialog(button);
    }
    render(){
        return (
            <MessagerDialog 
                ref={ref=>this.dialog=ref} 
                {...this.props} 
                {...this.state}
            />
        )
    }
}
Messager.propTypes = Object.assign({}, LocaleBase.propTypes, {
    messagerType: PropTypes.string,
    msg: PropTypes.string,
    content: PropTypes.func,
    icon: PropTypes.string,
    buttons: PropTypes.array
})
Messager.defaultProps = {
    buttons: [],
    defaultOk: 'Ok',
    defaultCancel: 'Cancel'
}
export default Messager


// WEBPACK FOOTER //
// ./src/components/messager/Messager.js