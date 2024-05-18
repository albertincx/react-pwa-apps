import React, {Component, useEffect, useState} from 'react';
import {CascadeData} from 'mobile-select';

import Storage from '../../utils/storage';

import MSComponent from './components/Ms';

import {APP_SETTINGS, POPUP_DISCUSS, POPUP_SETTINGS, SCROLL_VAR, TIMER_TITLE} from './consts';

import {getRandomMs, getSettings, getTimeStr} from './utils';

import {ISettings, IState} from './types';

import './style.css';

const demoData: { id: string; value: string; childs: { id: string; value: string; }[]; }[] = [];

const minDemoData: { id: string; value: string; }[] = [];

const h = new Date().getHours();
const m = new Date().getMinutes();

Array.from({length: 59}).map((_, idx) => {
    let min: string | number = getTimeStr(idx + 1);
    minDemoData.push({id: `${idx + 1}`, value: `${min}`})
})

Array.from({length: 23}).map((_, idx) => {
    let minArr = [...minDemoData];
    if (h === (idx + 1)) {
        const curMin = m;
        minArr = minArr.filter(({id}) => +id > curMin);
    }
    (idx + 1) >= h && demoData.push({id: `${idx + 1}`, value: `${idx + 1}`, childs: [...minArr]})
})

let countD: number = 0;

const url: string[] = location.href.split('timer=');

if (url[1]) {
    countD = +url[1];
    document.title = `${TIMER_TITLE}${countD}`
    // @ts-ignore
    window.safTimerBtn(+countD);
}

const initDemoData = [...demoData];

const MyApp = () => {
    const [countDown, setCountDown] = useState(countD);
    const [curDemoData] = useState(initDemoData);

    const reset = (cb?: () => void | number) => {
        if (typeof cb === "number") {
            if (cb === 1) {
                setCountDown(0);
            }
            return;
        }
        setCountDown(0);
        document.title = TIMER_TITLE
        window.history.pushState(null, document.title, '/');
        if (cb instanceof Function) cb();
    }

    const config = {
        ensureBtnText: 'start',
        cancelBtnText: 'cancel',
        wheels: [
            {
                data: curDemoData,
            },
        ],
        onChange: (data: string[] | number[] | CascadeData[]) => {
            const d = new Date();
            if (data?.length) {
                d.setHours((data[0] as CascadeData).id)
                d.setMinutes((data[1] as CascadeData).id)
                d.setSeconds(0)
                const tm = d.getTime() - (new Date()).getTime();
                const diffInSec = tm / 1000;
                if (diffInSec) {
                    reset(() => {
                        setCountDown(diffInSec);
                        // @ts-ignore
                        window.safTimerBtn(+diffInSec);
                    });
                }
            }
        },
    }

    const setTimer = (e: React.SyntheticEvent<EventTarget>) => {
        e.stopPropagation();
        e.preventDefault();
        if (!(e.target instanceof HTMLElement)) {
            return;
        }
        const tm = e.target.dataset.time;

        if (tm) {
            reset(() => {
                window.history.pushState('time', '', '#timer=' + tm);
                document.title = `${TIMER_TITLE}${tm}`
                setCountDown(+tm + getRandomMs());
                // @ts-ignore
                window.safTimerBtn(+tm + getRandomMs());
            })
        }

        return false;
    }

    const handleReset = (_: React.SyntheticEvent<EventTarget>) => {
        // @ts-ignore
        window.safTimerResetBtn()
        reset();
    }

    return (
        <>
            <div className="grid times">
                <a className="btn" href="/#timer=3" onClick={setTimer} data-time="3">3 sec</a>
                <a className="btn" href="/#timer=30" onClick={setTimer} data-time="30">30 sec</a>
                <a className="btn" href="/#timer=60" onClick={setTimer} data-time="60">1 min</a>
                <a className="btn" href="/#timer=120" onClick={setTimer} data-time="120">2 min</a>
                <a className="btn" href="/#timer=300" onClick={setTimer} data-time="300">5 min</a>
                <a className="btn" href="/#timer=600" onClick={setTimer} data-time="600">10 min</a>
                <a className="btn" href="/#timer=1200" onClick={setTimer} data-time="1200">20 min</a>
                <a className="btn" href="/#timer=1800" onClick={setTimer} data-time="1800">30 min</a>
                <a className="btn" href="/#timer=3600" onClick={setTimer} data-time="3600">1 hour</a>
                <a className="btn" href="/#timer=4800" onClick={setTimer} data-time="4800">1 h 20 min</a>
                <a className="btn" href="/#timer=5400" onClick={setTimer} data-time="5400">1 h 30 min</a>
            </div>
            <br/>
            <MSComponent config={config}/>
            {!!countDown && (
                <>
                    <br/>
                    <div className="timer">
                        <div className="timer-display">
                            <span className="hours" id="hhour" style={{display: 'none'}}></span>
                            <span className="colon" id="hhourSep" style={{display: 'none'}}>:</span>
                            <span className="minutes" id="mmin"></span>
                            <span className="colon">:</span>
                            <span className="seconds" id="ssec"></span>
                        </div>
                    </div>
                    <br/>
                    <button className="stop-timer btn" onClick={handleReset}>Stop timer!</button>
                </>
            )}
        </>
    );
}

interface Props {
    some?: string;
}

class Index extends Component<Props, IState> {
    constructor(props: Props) {
        super(props);
        this.state = {modal: ''};
    }

    componentDidMount() {
        const s = Storage.get(SCROLL_VAR, '0');
        if (s) {
            window.scrollTo(0, +s);
        }
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        Storage.set(SCROLL_VAR, window.scrollY);
    };

    togglePopup = (e: React.SyntheticEvent) => {
        e.preventDefault();
        this.setState({modal: ''});
    };

    closeModal = () => {
        this.setState({modal: ''});
    };

    voiceSetting = (e: React.SyntheticEvent) => {
        e && e.preventDefault();
        this.setState({modal: POPUP_SETTINGS});
    };

    voiceSettingSave = (newSettings: ISettings, force = false) => {
        const {} = newSettings;
        if (force) {
            //
        } else {
            return this.closeModal();
        }
        const oldSettings = getSettings() || {};
        // @ts-ignore
        Storage.setJ(APP_SETTINGS, {...oldSettings});
        this.setState({modal: ''});
    };


    render() {
        const {modal} = this.state;

        return (
            <>
                {modal === POPUP_DISCUSS ? (
                    <div className='modal-window'>
                        <div>
                            <a
                                href=''
                                title='Close'
                                className='modal-close'
                                onClick={this.togglePopup}
                            >
                                Close
                            </a>
                            <div>
                                <a
                                    href=''
                                    title='Close'
                                    className='modal-close bottom'
                                    onClick={this.togglePopup}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </div>
                ) : null}
                <MyApp/>
            </>
        );
    }
}

export default Index;
