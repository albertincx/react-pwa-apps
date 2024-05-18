import React from 'react';
import {DEMO_LANG} from "../consts";

import demo from '../demo/demo.json';
import demoRusSpa from '../demo/demorus_spa.json';
import demoSpaEng from '../demo/demospa_eng.json';
import {StorageFile} from "../types";

const Demo: React.FC<any> = ({togglePopup, upload}) => {
    const handleDemo = (demoLn: string) => () => {
        let files: StorageFile[] = demo;
        if (demoLn === DEMO_LANG['spa/eng']) files = demoSpaEng;
        if (demoLn === DEMO_LANG['rus/spa']) files = demoRusSpa;
        if (files) {
            upload(files);
        }
    }

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
                <h4>Demo subtitles</h4>
                <div>
                    {Object.keys(DEMO_LANG).map((demoKey: string) => {
                        return (
                            <div key={demoKey} className="btn-wrap file">
                                <div className="btn btn-primary" onClick={handleDemo((DEMO_LANG as any)[demoKey])}>
                                    {(DEMO_LANG as any)[demoKey].replace('_', ' / ')}
                                </div>
                            </div>
                        )
                    })}
                    <br/>
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

export default Demo;
