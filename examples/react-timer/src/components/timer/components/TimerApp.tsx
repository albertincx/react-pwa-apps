import React, {useEffect, useState} from 'react';
import Timepicker from 'grudus-timepicker';

import 'grudus-timepicker/dist/index.css'

import {TIMER_TITLE} from '../consts';
import {getRandomMs} from '../utils';

import {StorageManager} from "../../../utils/storage.ts";

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

interface ITimer {
    time?: number;
    name: string;
}

const initTimers: ITimer[] = [
    {name: '3 sec', time: 3},
    {name: '1 min', time: 60},
    {name: '5 min', time: 300},
    {name: '10 min', time: 600},
    {name: '20 min', time: 1200},
    {name: '30 min', time: 1800},
    {name: '1 hour', time: 3600},
    {name: '1 h 20 min', time: 4800},
    {name: '1 h 30 min', time: 5400},
];

const getInitTimers = () => {
    const sT = StorageManager.getJ('timers') || [];

    return sT.length ? sT : initTimers;
}

interface IProps {
    edit: boolean;
}

const TimerApp: React.FC<IProps> = ({edit}) => {
    const [countDown, setCountDown] = useState(countD);
    const [timers, setTimers] = useState<ITimer[]>(getInitTimers());

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

    const reBuildTimers = (addOrDeleteIndex: string | { name: '' } = '', cb?: () => void) => {
        let newTimers = [...timers];
        if (typeof addOrDeleteIndex !== 'string') {
            if (~newTimers.findIndex((t) => t.name === addOrDeleteIndex.name)) {
                // has timer do nothing
                return;
            }
            newTimers.push(addOrDeleteIndex);
        } else {
            newTimers = timers.filter(({time}) => `${time}` !== addOrDeleteIndex);
        }
        StorageManager.setJ('timers', newTimers);
        setTimers(newTimers);
        if (cb instanceof Function) cb();
    };

    const setTimer = (e: React.SyntheticEvent<EventTarget>) => {
        e.stopPropagation();
        e.preventDefault();
        if (!(e.target instanceof HTMLElement)) return;

        const toDelete = e.target.dataset.todelete;
        if (toDelete) {
            reBuildTimers(toDelete);
            return;
        }
        const tm = e.target.dataset.time;
        if (tm) {
            reset(() => {
                window.history.replaceState(null, '', '#timer=' + tm);
                setCountDown(+tm + getRandomMs());
                window.safTimerBtn(+tm);
            })
        } else {
            const countdown = e.target.dataset.countdown;
            Timepicker.showPicker({
                time: countdown ? new Date() : {hours: 0, minutes: 5},
                ...timerOpts,
                onSubmit: ({hours, minutes}) => {
                    let diffSeconds = 0;
                    if (!countdown) {
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
                        const newTime = {
                            time: diffSeconds,
                            name: `${hours ? `${hours} h ` : ''}${minutes} min`,
                        }
                        reBuildTimers(newTime, countdown && (() => {
                            reset(() => {
                                setCountDown(diffSeconds);
                                window.safTimerBtn(+diffSeconds);
                            });
                        }));
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

    const renderTimes = () => {
        return timers.map(({time, name}) => (
            <a key={`${time}${name}`} className="btn" href={`/#timer=${time}`} onClick={setTimer} data-time={time}>
                {name}
                <div className="edit" data-todelete={edit && time}>{edit ? (
                    <div className="icon-delete" data-todelete={time} />
                ) : ''}</div>
            </a>
        ))
    }

    return (
        <>
            <div className="grid times" data-edit={edit}>
                {renderTimes()}
                <a className="btn" href="/" onClick={setTimer} data-time="">+</a>
            </div>
            <br/>
            <div className="ms-default-trigger btn" onClick={setTimer} data-countdown="1">Start countdown timer</div>
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
