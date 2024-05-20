import React, {Component} from 'react';

import Storage from '../../utils/storage';

import {POPUP_DISCUSS, POPUP_SETTINGS, SCROLL_VAR, TIMER_TITLE} from './consts';

import {IState} from './types';

import TimerApp from './components/TimerApp.tsx';

import './style.css';

let countD: number = 0;

const url: string[] = location.href.split('timer=');

if (url[1]) {
    countD = +url[1];
    document.title = `${TIMER_TITLE}${countD}`
    window.safTimerBtn(+countD);
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
                <TimerApp />
            </>
        );
    }
}

export default Index;
