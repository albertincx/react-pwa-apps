import React, {useState} from 'react';

import {TIMER_TITLE} from './consts';

import TimerApp from './components/TimerApp.tsx';

import './style.css';

let countD: number = 0;

const url: string[] = location.href.split('timer=');

if (url[1]) {
    countD = +url[1];
    document.title = `${TIMER_TITLE}${countD}`
    window.safTimerBtn(+countD);
}

interface IProps {
    some?: string;
}

const Index: React.FC<IProps> = () => {
    const [edit, setEdit] = useState(false);

    const toggleEdit = (e: React.SyntheticEvent) => {
        e && e.preventDefault();
        setEdit(!edit);
    }

    return (
        <>
            <div>
                <div className='buttons'>
                    <button
                        className='icon icon-settings'
                        onClick={toggleEdit}
                    />
                </div>
            </div>
            <TimerApp edit={edit} />
        </>
    )
}

export default Index;
