import React, {useEffect, useState} from 'react';
import Timepicker from 'grudus-timepicker';

import 'grudus-timepicker/dist/index.css'

import {TIMER_TITLE} from '../consts';
import {getRandomMs} from '../utils';

let countD: number = 0;

const url: string[] = location.href.split('timer=');

if (url[1]) {
    countD = +url[1];
    document.title = `${TIMER_TITLE}${countD}`
    window.safTimerBtn(+countD);
}

const timerOpts = {
    headerBackground: '#424242',
    headerColor: '#e0e0e0',
    headerSelected: '#fafafa',
    wrapperBackground: "#424242",
    footerBackground: "#424242",
    submitColor: "#F44336",
    cancelColor: "#F44336",
    clockBackground: "#424242",
    clockItemColor: "#fafafa",
    clockItemInnerColor: "#e0e0e0",
    handColor: "#F44336",
}

const TimerApp = () => {
    const [countDown, setCountDown] = useState(countD);

    useEffect(() => {
        if (!window.resetReactApp) {
            window.resetReactApp = () => {
                setCountDown(0)
            };
        }
    }, []);

    const reset = (cb?: () => void) => {
        setCountDown(0);
        document.title = TIMER_TITLE
        window.history.replaceState(null, document.title, '/');

        if (cb instanceof Function) cb();
    }

    const setTimer = (e: React.SyntheticEvent<EventTarget>) => {
        e.stopPropagation();
        e.preventDefault();
        if (!(e.target instanceof HTMLElement)) return;

        const tm = e.target.dataset.time;
        if (tm) {
            reset(() => {
                window.history.replaceState(null, '', '#timer=' + tm);
                setCountDown(+tm + getRandomMs());
                window.safTimerBtn(+tm);
            })
        } else {
            const current = e.target.dataset.current;
            Timepicker.showPicker({
                time: current ? new Date() : {hours: 0, minutes: 5},
                ...timerOpts,
                onSubmit: ({hours, minutes}) => {
                    let diffSeconds = 0;
                    if (!current) {
                        if (hours) {
                            diffSeconds = hours * 60 * 60;
                        }
                        if (minutes) {
                            diffSeconds += minutes * 60;
                        }
                    } else {
                        const d = new Date();
                        d.setHours(hours)
                        d.setMinutes(minutes)
                        d.setSeconds(0)
                        const tm = d.getTime() - (new Date()).getTime();
                        diffSeconds = tm / 1000;
                    }
                    if (diffSeconds) {
                        reset(() => {
                            setCountDown(diffSeconds);
                            window.safTimerBtn(+diffSeconds);
                        });
                    }
                },
            });
        }

        return false;
    }

    const handleReset = (_: React.SyntheticEvent<EventTarget>) => {
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
                <a className="btn" href="/" onClick={setTimer} data-time="">+</a>
            </div>
            <br/>
            <div className="ms-default-trigger btn" onClick={setTimer} data-current="1">Select countdown time</div>
            <br/>
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

export default TimerApp
