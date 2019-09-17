import React from 'react';
import PropTypes from 'prop-types';
import classHelper from '../base/ClassHelper';
import { MyEvent } from '../base/DomHelper';
import domHelper from '../base/DomHelper';
import FieldBase from '../base/FieldBase';
import Draggable from '../draggable/Draggable';

class Slider extends FieldBase{
    constructor(props){
        super(props);
        Object.assign(this.state, {
            value: props.value
        });
    }
    componentWillReceiveProps(nextProps) {
        super.componentWillReceiveProps(nextProps);
        if (nextProps.value !== this.props.value){
            this.setValue(nextProps.value);
        }
    }
    isDiff(value1, value2){
        return value1 !== value2;
    }
    setValue(value){
        if (this.isDiff(value, this.state.value)){
            this.setState({value:value}, ()=>{
                this.props.onChange(value);
                if (this.context && this.context.fieldChange){
                    this.context.fieldChange(this,value);
                }
            });
        }
    }
    value1(){
        const {value} = this.state;
        return value instanceof Array ? value[0] : value;
    }
    value2(){
        const {value} = this.state;
        return this.props.range ? (value ? value[1] : null) : null;
    }
    displayingRule(){
        const {mode,reversed} = this.props;
        let rule = mode === 'h' ? this.props.rule : this.props.rule.slice(0).reverse();
        if (reversed){
            rule = rule.slice(0).reverse();
        }
        return rule;
    }
    value2pos(value) {
        const {reversed,mode,min,max} = this.props;
        let pos = (value - min) * 100.0 / (max - min);
        if (mode === 'v'){
            pos = 100 - pos;
        }
        if (reversed){
            pos = 100 - pos;
        }
        return pos;
    }
    pos2value(pos) {
        const {reversed,mode,min,max} = this.props;
        let size = mode==='h' ? domHelper.outerWidth(this.sliderRef) : domHelper.outerHeight(this.sliderRef);
        pos = mode==='h' ? (reversed?(size-pos):pos) : (reversed?pos:(size-pos));
        let value = min + (max-min)*(pos/size);
        return +value.toFixed(0);
    }
    setPos(pos, second=false) {
        const {step,range} = this.props;
        let value = this.pos2value(pos);
        let s = Math.abs(value % step);
        if (s < step/2){
            value -= s;
        } else {
            value = value - s + step;
        }
        if (range){
            let v1 = this.value1();
            let v2 = this.value2();
            if (second){
                if (value < v1){
                    value = v1;
                }
                v2 = value;
            } else {
                if (value > v2){
                    value = v2;
                }
                v1 = value;
            }
            this.setValue([v1,v2]);
        } else {
            this.setValue(value);
        }
        return value;
    }
    handleDrag(event, second=false) {
        const {disabled,mode} = this.props;
        if (disabled){
            return;
        }
        if (mode === 'h'){
            let width = domHelper.outerWidth(this.sliderRef);
            if (event.left < 0){
                event.left = 0;
            }
            if (event.left > width){
                event.left = width;
            }
        } else {
            let height = domHelper.outerHeight(this.sliderRef);
            if (event.top < 0){
                event.top = 0;
            }
            if (event.top > height){
                event.top = height;
            }
        }
        if (mode === 'h'){
            let width = domHelper.outerWidth(this.sliderRef);
            let value = this.setPos(event.left, second);
            event.left = this.value2pos(value) * width / 100;
        } else {
            let height = domHelper.outerHeight(this.sliderRef);
            let value = this.setPos(event.top, second);
            event.top = this.value2pos(value) * height / 100;
        }
        event.target.applyDrag();
    }
    handleDown(event) {
        const {disabled,mode,step,range} = this.props;
        if (disabled){
            return;
        }
        event = new MyEvent(event);
        let offset = domHelper.offset(this.sinnerRef);
        let pos = mode === 'h' ? event.pageX-offset.left : event.pageY-offset.top;
        let value = this.pos2value(pos);
        let s = Math.abs(value % step);
        if (s < step/2){
            value -= s;
        } else {
            value = value - s + step;
        }
        if (range){
            let v1 = this.value1();
            let v2 = this.value2();
            let m = (v1+v2)/2.0;
            if (value < v1){
                v1 = value;
            } else if (value > v2){
                v2 = value;
            } else {
                value < m ? v1 = value : v2 = value;
            }
            this.setValue([v1, v2]);
        } else {
            this.setValue(value);
        }
    }
    getPosStyle(value) {
        const {mode} = this.props;
        let pos = this.value2pos(value);
        return mode === 'h' ? {left:pos+'%'} : {top:pos+'%'};
    }
    getRuleValueStyle(index) {
        let distance = index*100/(this.displayingRule().length-1)+'%';
        return this.props.mode === 'h' ? {left:distance} : {top:distance};
    }
    sliderClasses(){
        const {disabled,mode} = this.props;
        return classHelper.classNames(['slider', this.props.className, {
            'slider-disabled': disabled,
            'f-row slider-v': mode==='v',
            'f-column slider-h': mode==='h'
        }]);
    }
    renderHandle(range){
        if (range && !this.props.range){
            return null;
        }
        const dragProps = {
            disabled: this.props.disabled,
            axis: this.props.mode,
            cursor: 'pointer',
            onDrag: (event)=>this.handleDrag(event,range)
        }
        const style = this.getPosStyle(range ? this.value2() : this.value1());
        return (
            <Draggable {...dragProps}>
                <a href=" " className="slider-handle" style={style} onClick={e=>e.preventDefault()}> </a>
            </Draggable>
        )
    }
    renderTip(range){
        if (!this.props.showTip){
            return null;
        }
        if (range && !this.props.range){
            return null;
        }
        const value = range ? this.value2() : this.value1();
        return (
            <span className="slider-tip" style={this.getPosStyle(value)}>{value}</span>
        )
    }
    renderRule(){
        if (!this.props.rule.length){
            return null;
        }
        const rule = this.displayingRule();
        return [
            <div key="rule" className="slider-rule">
            {
                rule.map((v,index) => (
                    <span key={index} style={this.getRuleValueStyle(index)}></span>
                ))
            }
            </div>,
            <div key="label" className="slider-rulelabel">
            {
                rule.map((v,index) => (
                    <span key={index} style={this.getRuleValueStyle(index)}>{v==='|'?'':v}</span>
                ))
            }
            </div>
        ]
    }
    render(){
        return (
            <div className={this.sliderClasses()} style={this.props.style} ref={el=>this.sliderRef=el}>
                <div className="slider-inner"
                    ref={el=>this.sinnerRef=el}
                    onMouseDown={this.handleDown.bind(this)}
                    onTouchStart={this.handleDown.bind(this)}
                >
                {this.renderHandle(false)}
                {this.renderTip(false)}
                {this.renderHandle(true)}
                {this.renderTip(true)}
                </div>
                {this.renderRule()}
            </div>
        )
    }
}
Slider.propTypes = Object.assign({}, FieldBase.propTypes, {
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array
    ]),
    mode: PropTypes.string,
    reversed: PropTypes.bool,
    showTip: PropTypes.bool,
    disabled: PropTypes.bool,
    range: PropTypes.bool,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    rule: PropTypes.array
})
Slider.defaultProps = Object.assign({}, FieldBase.defaultProps, {
    mode: 'h',
    reversed: false,
    showTip: false,
    disabled: false,
    range: false,
    min: 0,
    max: 100,
    step: 1,
    rule: [],
    onChange(value){}
})
export default Slider


// WEBPACK FOOTER //
// ./src/components/slider/Slider.js