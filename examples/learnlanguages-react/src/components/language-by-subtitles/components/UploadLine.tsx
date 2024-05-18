import React from 'react';
import {ACCEPT, ADD_FILES, FIRST_MESSAGE, TRY_DEMO} from "../consts";
import UploadButton from "./UploadButton";

const UploadLine: React.FC<any> = ({handleUpload, toggleDemo}) => {
    return (
        <div>
            <div className="label">{FIRST_MESSAGE}</div>
            <div className='flexible'>
                <div className="btn modal-btn">
                    <UploadButton
                        type={ACCEPT}
                        upload={handleUpload}
                        label={ADD_FILES}
                        className=" upload-btn"
                    />
                </div>
                <div className='btn btn-ghost-success'>or</div>
                <button className='btn' onClick={toggleDemo}>{TRY_DEMO}</button>
            </div>
        </div>
    );
}

export default UploadLine;
