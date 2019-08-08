export class ClassHelper{
    classNames(){
        let cc = [];
        for(let i=0; i<arguments.length; i++){
            let val = arguments[i];
            if (!val){
                continue;
            }
            if (val instanceof Array){
                let result = this.classNames.apply(this, val);
                if (result){
                    cc.push(result);
                }
            } else if (typeof val === 'object'){
                for(let key in val){
                    if (val[key]){
                        cc.push(key);
                    }
                }
            } else {
                cc.push(val);
            }
        }
        return cc.join(' ');
    }
}
export default new ClassHelper();



// WEBPACK FOOTER //
// ./src/components/base/ClassHelper.js