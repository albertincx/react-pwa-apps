import React, {useEffect} from 'react';
import Storage from "../../../utils/storage";
import History from "./History";
import {langBS_history} from "../consts";
import UploadLine from "./UploadLine";
import File from "./File";

const Files: React.FC<any> = ({clear, togglePopup, upload, demo}) => {
    useEffect(() => {
        // createTree();
    }, []);
    return (
        <div className='modal-window'>
            <div>
                <a
                    href=''
                    title='Close'
                    className='modal-close'
                    onClick={e => togglePopup(e, false)}
                >
                    Close
                </a>
                <h4>Files</h4>
                <div>
                    <div className="history">
                        <UploadLine handleUpload={upload} toggleDemo={demo} />
                        <br/>
                        <div className="file">
                            <File deleteFunc={clear} />
                        </div>
                    </div>
                    {/*<div className="row">*/}
                    {/*    <div className="col s12 m4" id="treeView"/>*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <NavBar nav={navLinks} id={"navBar"}/>*/}
                    {/*</div>*/}
                    <br/>
                    {Storage.getJ(langBS_history)?.length ? <History upload={upload}/> : null}
                    <div>
                        <a
                            href=''
                            title='Close'
                            className='modal-close bottom'
                            onClick={e => togglePopup(e, false)}
                        >
                            Close
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Files;
