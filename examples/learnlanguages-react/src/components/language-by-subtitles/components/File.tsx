import React from 'react';
import {getName} from "../utils";

const File: React.FC<any> = ({deleteFunc, restoreFunc, subs}) => {
    const names = getName(subs);
    return (
        <>
            <div>{names?.[0]}</div>
            <div className="flexible">
                <div>{names?.[1]}</div>
                {restoreFunc ? (
                    <button className='btn' onClick={restoreFunc}>
                        Restore
                    </button>
                ) : null}
                {deleteFunc ? (
                    <button className='btn' onClick={deleteFunc}>
                        Delete
                    </button>
                ) : null}
            </div>
        </>
    );
}

export default File;
