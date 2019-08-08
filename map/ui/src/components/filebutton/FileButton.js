import React from 'react';
import PropTypes from 'prop-types';
import LinkButton from '../linkbutton/LinkButton';

class FileButton extends LinkButton{
    componentDidMount(){
        this.getFiles();
    }
    getFiles(){
        let files = [];
        for (let i=0; i<this.fileRef.files.length; i++){
            files.push(this.fileRef.files[i]);
        }
        return files;
    }
    upload() {
        const {url,method,name,withCredentials} = this.props;
        const files = this.getFiles();
        if (!url){
            return;
        }
		let xhr = new XMLHttpRequest();
		let formData = new FormData();
		for(let i=0; i<files.length; i++){
			let file = files[i];
			formData.append(name, file, file.name);
		}
		xhr.upload.addEventListener('progress', (e) => {
			if (e.lengthComputable){
				let total = e.total;
				let position = e.loaded;
				let percent = Math.ceil(position * 100 / total);
                this.props.onProgress(percent);
			}
		}, false);
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4){
				if (xhr.status >= 200 && xhr.status < 300){
					this.props.onSuccess({xhr:xhr,files:files});
				} else {
					this.props.onError({xhr:xhr,files:files});
				}
			}
		};
		xhr.open(method, url, true);
		xhr.withCredentials = withCredentials;
		xhr.send(formData);
    }
    clear(){
        this.fileRef.value = '';
    }
    handleFileSelect(){
        const files = this.getFiles();
        this.props.onSelect(files);
        if (files.length && this.props.autoUpload){
            this.upload();
        }
    }
    renderOthers(){
        const {disabled,multiple,accept,capture} = this.props;
        const fileId = '_easyui_file_' + FileButton.fileId++;
        const props = {
            id: fileId,
            type: 'file',
            disabled: disabled?disabled:null,
            multiple: multiple?multiple:null,
            accept: accept,
            capture: capture,
            onChange: this.handleFileSelect.bind(this)
        }
        return (
            <label className="filebox-label" htmlFor={fileId}>
                <input {...props} ref={el=>this.fileRef=el} style={{position:'absolute',left:-5000000}}></input>
            </label>
        )
    }
}
FileButton.fileId = 1;
FileButton.propTypes = Object.assign({}, LinkButton.propTypes, {
    accept: PropTypes.string,
    capture: PropTypes.string,
    multiple: PropTypes.bool,
    url: PropTypes.string,
    method: PropTypes.string,
    autoUpload: PropTypes.bool,
    withCredentials: PropTypes.bool
})
FileButton.defaultProps = Object.assign({}, LinkButton.defaultProps, {
    href: '_',
    name: 'file',
    multiple: false,
    method: 'POST',
    autoUpload: true,
    withCredentials: true,
    onSelect(files){},
    onProgress(percent){},
    onSuccess({xhr,files}){},
    onError({xhr,files}){},
})
export default FileButton


// WEBPACK FOOTER //
// ./src/components/filebutton/FileButton.js