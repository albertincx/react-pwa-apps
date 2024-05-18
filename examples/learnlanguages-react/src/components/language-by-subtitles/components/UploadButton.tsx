import React, {Component, RefObject} from 'react';

class UploadButton extends Component<any, any> {
    dropEl: RefObject<any>;

    constructor(props: any) {
        super(props);
        this.dropEl = React.createRef();
    }

    getFile = (event: any) => {
        const {upload} = this.props;
        if (upload) {
            const input = event.target;
            const tasks = [];
            if ('files' in input && input.files.length > 0) {
                for (let i = 0; i < input.files.length; i += 1) {
                    tasks.push(this.readFileContent(input.files[i]));
                }
            }
            Promise.all(tasks).then(fileData => upload(fileData));
        }
    };

    // @ts-ignore
    readFileContent(file: any, cp1251 = false) {
        const reader = new FileReader();
        const rABS = false;
        return new Promise((resolve, reject) => {
            reader.onload = (e: any) => {
                const bstr = e.target.result;
                if (bstr.match('�')) {
                    reject('cp1251');
                    return;
                }
                const error = '';
                const fileObj = {
                    bstr,
                    rABS,
                    filename: file.name,
                    error,
                };
                resolve(fileObj);
            };
            if (cp1251) {
                reader.readAsText(file, 'CP1251');
            } else {
                reader.readAsText(file);
            }
            // reader.readAsText(file, 'utf8');
        }).catch(error => {
            if (error === 'cp1251') {
                return this.readFileContent(file, true);
            }
            return '';
        });
    }

    dragLeave = () => {
        if (this.dropEl.current) {
            this.dropEl.current.classList.remove('over');
        }
    };

    dropEnter = () => {
        if (this.dropEl.current) this.dropEl.current.classList.add('over');
    };

    clickFile = () => {
        document.getElementById('files')?.click();
    };

    renderInput({onChange, type, multiple}: any) {
        const classN = `btn btn-primary`;
        const {className} = this.props;

        return (
            <div
                onDragEnter={this.dropEnter}
                ref={this.dropEl}
                onDragLeave={this.dragLeave}
            >
                <input
                    placeholder="Choose or Drop files"
                    onChange={onChange}
                    type="file"
                    style={{display: 'none'}}
                    multiple={multiple}
                    accept={type}
                    tabIndex={-1}
                    id="files"
                />
                <input
                    className={classN + className}
                    type="button"
                    value="Browse..."
                    onClick={this.clickFile}
                />
            </div>
        );
    }

    render() {
        const {type, isSingle} = this.props;

        return (
            <div className="btn-wrap">
                {this.renderInput({
                    onChange: this.getFile,
                    type,
                    multiple: !isSingle,
                })}
            </div>
        );
    }
}

export default UploadButton;
