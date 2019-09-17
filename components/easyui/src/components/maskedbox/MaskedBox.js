import React from 'react';
import PropTypes from 'prop-types';
import TextBox from '../textbox/TextBox';

class MaskedBox extends TextBox{
    componentDidMount(){
        super.componentDidMount();
        let value = this.formatter(this.parser(this.state.value));
        this.setState({value:value,text:value})
    }
    parser(value) {
        const {mask,masks,promptChar} = this.props;
		let tt = (value || this.state.text || '').split('');
		let vv = [];
		for(let i=0; i<mask.length; i++){
			if (masks[mask[i]]){
				let t = tt[i];
				vv.push(t !== promptChar ? t : ' ');
			}
		}
		return vv.join('');
    }
    formatter(value){
        const {mask,masks,promptChar} = this.props;
		let cc = (value||'').split('');
		let tt = [];
		for(let i=0; i<mask.length; i++){
			let m = mask[i];
			let r = masks[m];
			if (r){
				let c = cc.shift();
				if (c != null){
					let d = new RegExp(r, 'i');
					if (d.test(c)){
						tt.push(c);
						continue;
					}
				}
				tt.push(promptChar);
			} else {
				tt.push(m);
			}
		}
		return tt.join('');
    }
    getInputOffset(pos){
        const {mask,masks} = this.props;
		let offset = 0;
		if (pos >= mask.length){
			pos --;
		}
		for(let i=pos; i>=0; i--){
			if (masks[mask[i]] == null){
				offset ++;
			}
		}
		return offset;
    }
    seekNext(pos){
        const {mask,masks} = this.props;
		let m = mask[pos];
		let r = masks[m];
		while(pos < mask.length && !r){
			pos ++;
			m = mask[pos];
			r = masks[m];
		}
		return pos;
    }
    seekPrev(pos){
        const {mask,masks} = this.props;
		let m = mask[--pos];
		let r = masks[m];
		while(pos >= 0 && !r){
			pos --;
			m = mask[pos];
			r = masks[m];
		}
		return pos < 0 ? 0 : pos;
    }
    insertChar(c){
        const {mask,masks} = this.props;
		let range = this.getSelectionRange();
		let start = this.seekNext(range.start);
		let end = this.seekNext(range.end);
		if (start !== -1){
			let r = new RegExp(masks[mask[start]], 'i');
			if (r.test(c)){
				let vv = this.parser(this.state.text).split('');
				let startOffset = start - this.getInputOffset(start);
				let endOffset = end - this.getInputOffset(end);
				vv.splice(startOffset, endOffset-startOffset, c);
                this.setValue(this.formatter(vv.join('')));
                this.setState({}, ()=>{
                    start = this.seekNext(++start);
                    this.setSelectionRange(start, start);
                })
			}
		}
    }
    deleteChar(backspace){
		let vv = this.parser(this.state.text).split('');
		let range = this.getSelectionRange();
		let start = 0;
		if (range.start === range.end){
			start = backspace ? this.seekPrev(range.start) : this.seekNext(range.start);
			let startOffset = start - this.getInputOffset(start);
			if (startOffset >= 0){
				vv.splice(startOffset, 1);
			}
		} else {
			start = this.seekNext(range.start);
			let end = this.seekPrev(range.end);
			let startOffset = start - this.getInputOffset(start);
			let endOffset = end - this.getInputOffset(end);
			vv.splice(startOffset, endOffset-startOffset+1);
        }
        this.setValue(this.formatter(vv.join('')));
        this.setState({}, ()=>{
            this.setSelectionRange(start, start);
        })
    }
    handleKeyDown(e){
        if (e.metaKey || e.ctrlKey){
			return;
		}
		let keyCodes = [9,13,35,36,37,39];
		if (keyCodes.indexOf(e.keyCode) >= 0){
			return;
		}
		let c = String.fromCharCode(e.keyCode);
		if (e.keyCode >= 65 && e.keyCode <= 90 && !e.shiftKey){
			c = c.toLowerCase();
		} else if (e.keyCode === 189){
			c = '-';
		} else if (e.keyCode === 187){
			c = '+';
		} else if (e.keyCode === 190){
			c = '.';
		}
		if (e.keyCode === 8){	// backspace
			this.deleteChar(true);
		} else if (e.keyCode === 46){	// del
			this.deleteChar(false);
		} else {
			this.insertChar(c);
        }
        e.preventDefault();
		e.stopPropagation();
    }
    renderInput(){
        return React.cloneElement(super.renderInput(), {
            onKeyDown: this.handleKeyDown.bind(this)
        })
    }
}
MaskedBox.propTypes = Object.assign({}, TextBox.propTypes, {
    mask: PropTypes.string,
    promptChar: PropTypes.string,
    masks: PropTypes.object
})
MaskedBox.defaultProps = Object.assign({}, TextBox.defaultProps, {
    promptChar: '_',
    masks: {
		'9': '[0-9]',
		'a': '[a-zA-Z]',
		'*': '[0-9a-zA-Z]'
	}
})
export default MaskedBox


// WEBPACK FOOTER //
// ./src/components/maskedbox/MaskedBox.js