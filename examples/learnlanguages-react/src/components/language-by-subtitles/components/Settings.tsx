import React, {useEffect, useState} from 'react';
import {testLoadVoices} from "../utils";

window.tryToCopyLines = () => {
    if (typeof window.availableVoicesTxt === 'undefined') {
        return;
    }
    navigator.clipboard.writeText(window.availableVoicesTxt);
}

type IProps = {
    data: any;
    togglePopup: any;
    voiceSettingSave: any;
}

const Settings: React.FC<IProps> = ({data, togglePopup, voiceSettingSave}) => {
    const {voice, error, volume, rate, pitch} = data;
    const [state, setState] = useState({
        voice,
        volume,
        rate,
        pitch
    });

    useEffect(() => {
        testLoadVoices(voice);
    }, []);

    const voiceSettings = (e: any) => {
        const {name, value} = e.target;
        // @ts-ignore
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const settingSave = (e: any) => {
        if (!voice && !state.voice) {
            return;
        }
        voiceSettingSave(state);

        e.preventDefault();

        return false
    };
    const clearSettings = (e: any) => {
        voiceSettingSave({
            ...state,
            voice: '',
            langs: null,
        }, true)
        togglePopup(e, false);
    };
    console.log(state);
    return (
        <div className='lang-subs'>
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
                    <h4>Web Speech Synthesis Demo</h4>

                    <div>
                        <form onSubmit={() => false} id="settings-form" data-voice={voice}>
                            <div id='page-wrapper'>
                                <p id='msg'/>
                                <div className='option'>
                                    <label htmlFor='voice'>Voice</label>
                                    {' '}
                                    <select
                                        required
                                        name='voice'
                                        id='voice'
                                        value={state.voice || ''}
                                        onChange={voiceSettings}
                                    />
                                </div>
                                <div className='option'>
                                    <label htmlFor='volume'>Volume</label>
                                    <input
                                        type='range'
                                        min='0'
                                        max='1'
                                        step='0.1'
                                        name='volume'
                                        id='volume'
                                        value={state.volume}
                                        onChange={voiceSettings}
                                    />
                                </div>
                                <div className='option'>
                                    <label htmlFor='rate'>Rate</label>
                                    <input
                                        type='range'
                                        min='0.1'
                                        max='10'
                                        step='0.1'
                                        name='rate'
                                        id='rate'
                                        value={state.rate}
                                        onChange={voiceSettings}
                                    />
                                </div>
                                <div className='option'>
                                    <label htmlFor='pitch'>Pitch</label>
                                    <input
                                        type='range'
                                        min='0'
                                        max='2'
                                        step='0.1'
                                        name='pitch'
                                        id='pitch'
                                        value={state.pitch}
                                        onChange={voiceSettings}
                                    />
                                </div>
                                {error ? <div color='red'>{error}</div> : null}
                                <div className="btn-wrap">
                                    <button className='btn btn-primary' onClick={settingSave}>Save</button>
                                    &nbsp;&nbsp;
                                    <button className='btn btn-danger' onClick={clearSettings}>Clear Settings</button>
                                </div>
                            </div>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
