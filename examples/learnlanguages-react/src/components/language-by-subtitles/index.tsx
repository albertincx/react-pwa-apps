import React, {Component} from 'react';
import UploadButton from './components/UploadButton';
import Storage from '../../utils/storage';
import './style.css';
import Settings from "./components/Settings";
import Files from "./components/Files";
import History from "./components/History";
import {ACCEPT, LANG_SUBS_SETTINGS, POPUP_DEMO, POPUP_DISCUSS, POPUP_SETTINGS, SCROLL_VAR, SUBS_KEY} from "./consts";
import {
    getLocales,
    findSubs,
    getItems, getSettings,
    getSubs,
    saveToLocalStorage,
    speak,
    testLoadVoices,
    addLanguages
} from "./utils";
import UploadLine from "./components/UploadLine";
import Demo from "./components/Demo";
import {ISettings} from "./types";

const errors: any = {
    SAME: 'Files same, please upload different filename',
    EMPTY: 'One of uploaded file has empty content, please upload another file',
};

interface IState {
    showStr: string,
    ind: any,
    isShown: any,
    error: string,
    filenames: any[],
    items: any[],
    showPopupFiles: boolean,
    modal: string,
    voice: any,
    rate: any,
    volume: any,
    pitch: any,
}

class Index extends Component<any, IState> {
    buttonPressTimer: any;

    constructor(props: any) {
        super(props);
        this.buttonPressTimer = undefined;
        const {items = [], filenames = []} = getItems(getSubs());
        const {voice, rate = 1, volume = 1, pitch = 1} = getSettings();
        this.state = {
            showStr: '',
            ind: '',
            isShown: -1,
            error: '',
            filenames,
            items,
            showPopupFiles: false,
            modal: '',
            voice,
            rate,
            volume,
            pitch,
        };
    }

    handleUpload = (files: any[], restore = false) => {
        let {filenames: stateFiles} = this.state;
        // const groups = groupSubs(files.map(i => i.filename));
        if (stateFiles.length === 1 && files[0].filename === stateFiles[0]) {
            this.setState({error: 'SAME'});
            return;
        }
        if (files.length === 1 && stateFiles.length === 1 && getSubs()[0]) {
            files = files.concat([...getSubs()]);
        }
        const newState: any = findSubs(files, restore);
        if (restore) {
            newState.modal = '';
        }
        newState.modal = '';
        newState.showPopupFiles = false;

        this.setState(() => ({...newState}));
    }

    clear = () => {
        const subs = getSubs();
        saveToLocalStorage(subs, true);
        Storage.rm(SUBS_KEY);
        this.setState({
            filenames: [],
            items: [],
            showPopupFiles: false,
            showStr: '',
            error: '',
        });
    };

    switchLanguages = () => {
        let subs = getSubs();
        if (subs.length <= 1) {
            return;
        }
        subs = [subs[1], subs[0]];
        Storage.setJ(SUBS_KEY, subs);
        const {items} = getItems(subs);
        this.setState({items});
    };

    show = ({target}: any, trySpeak = false) => {
        if (target.tagName === 'BUTTON') {
            return
        }
        const currentRowIndex = target.dataset.ind;

        const {items, isShown: isShown1, ind: indFrom} = this.state;
        let isShown = isShown1;
        const [, itemTwo] = items;

        if (itemTwo[currentRowIndex]) {
            isShown = currentRowIndex !== indFrom || !isShown;
            let showStr = '';
            if (isShown) {
                showStr = itemTwo[currentRowIndex];
            }
            this.setState({showStr, ind: currentRowIndex, isShown}, () => {
                trySpeak && this.tryToSpeak(showStr)()
            });
        }
    };

    handleButtonRelease = () => {
        if (this.buttonPressTimer) {
            clearTimeout(this.buttonPressTimer);
        }
    };

    componentDidMount() {
        const s = Storage.get(SCROLL_VAR, false);
        // setupLanguages();
        testLoadVoices();
        if (s) {
            window.scrollTo(0, s);
        }
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        Storage.set(SCROLL_VAR, window.scrollY);
    };

    getStr = (str: string) => {
        const strS = str.split(/>\s[0-9]+:[0-9]+:[0-9]+[.,][0-9]+/);
        if (strS[1]) str = strS[1];
        return str;
    };

    renderRow = (str: string, index: any) => {
        str = this.getStr(str);
        if (!str) {
            return null;
        }
        return (
            <div
                key={`${str}${index}`}
                onTouchEnd={this.handleButtonRelease}
                onMouseDown={this.show}
                onMouseUp={this.handleButtonRelease}
                data-ind={index}
            >
                <div data-ind={index}>
                    {str}
                    <span className='tooltiptext'>
                        {str ? (
                            <button
                                data-ind={this.state.showStr && index}
                                onClick={this.tryToSpeak(str)}
                                className='icon speech-voice'
                            />
                        ) : null}
                    </span>
                </div>
            </div>
        );
    };

    togglePopup = (e: any, s: boolean = true) => {
        e.preventDefault();
        this.setState({showPopupFiles: s, modal: ''});
    };

    toggleDemo = (e: any) => {
        if (this.state.modal === POPUP_DEMO) {
            return this.togglePopup(e, false);
        }
        this.toggleModal(e, POPUP_DEMO);
    };

    toggleModal = (e: any, modal = POPUP_DISCUSS) => {
        e.preventDefault();
        this.setState({modal});
    };

    render() {
        const {
            items,
            showStr,
            error,
            filenames,
            showPopupFiles,
            modal,
        } = this.state;
        const fldCl = `folder${items.length ? '-fill' : ''}`;

        return (
            <div className='lang-subs'>
                {showPopupFiles ? (
                    <Files
                        filenames={filenames}
                        togglePopup={this.togglePopup}
                        clear={this.clear}
                        upload={this.handleUpload}
                        demo={this.toggleDemo}
                    />
                ) : null}
                {modal === POPUP_DEMO ? (
                    <Demo
                        filenames={filenames}
                        togglePopup={this.togglePopup}
                        clear={this.clear}
                        upload={this.handleUpload}
                    />
                ) : null}
                {modal === POPUP_DISCUSS ? (
                    <div className='modal-window'>
                        <div>
                            <a
                                href=''
                                title='Close'
                                className='modal-close'
                                onClick={e => this.togglePopup(e, false)}
                            >
                                Close
                            </a>
                            <h1>Subs</h1>
                            <div>
                                Upload your subs in channel:
                                <a href='tg://resolve?domain=langbysubs'>&nbsp;@langbysubs</a>
                            </div>
                            <div>
                                <a
                                    href=''
                                    title='Close'
                                    className='modal-close bottom'
                                    onClick={e => this.togglePopup(e, false)}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </div>
                ) : null}
                {showStr ? (
                    <div className='tooltip1'>
                        <span className='tooltiptext'>{this.getStr(showStr)}</span>
                    </div>
                ) : null}
                <div>
                    <div className='buttons'>
                        {items.length === 2 ? (
                            <button
                                className={`icon ${fldCl}-icon`}
                                onClick={this.togglePopup}
                            />
                        ) : null}
                        <button
                            className='icon earth-search'
                            onClick={this.toggleModal}
                        />
                        <button
                            className='icon speech-voice-setting'
                            onClick={this.voiceSetting}
                        />
                    </div>
                </div>
                <div>
                    {items.length === 2 ? (
                        <div className='button-replace'>
                            <button className='icon replace-icon' onClick={this.switchLanguages}/>
                        </div>
                    ) : null}
                </div>
                <div className='lang-items'>
                    {!items.length ? (
                        <>
                            <UploadLine handleUpload={this.handleUpload} toggleDemo={this.toggleDemo}/>
                            <History upload={this.handleUpload}/>
                        </>
                    ) : null}
                    {items.length === 1 ? (
                        <div className='load-step'>
                            {error ? (
                                <>
                                    <div className='alert alert-danger'>{errors[error]}
                                    </div>
                                    <br/>
                                </>
                            ) : null}
                            <div>
                                1 File {filenames[0]}
                                <span className='green'> loaded</span>
                            </div>
                            <div>
                                2 File <span className='gray'>not loaded</span>
                            </div>
                            <UploadButton
                                upload={this.handleUpload}
                                type={ACCEPT}
                                label='Add second subtitles file'
                                className=" upload-btn"
                                isSingle
                            />
                            <br/>
                            <div>
                                <button className='btn' onClick={this.clear}>
                                    Delete all
                                </button>
                            </div>
                        </div>
                    ) : null}
                    {items.length === 2
                        ? items[0].map((str: string, ind: number) => this.renderRow(str, ind))
                        : null}
                </div>
                {modal === POPUP_SETTINGS ? (
                    <Settings
                        data={this.state}
                        togglePopup={this.togglePopup}
                        voiceSettingSave={this.voiceSettingSave}
                    />
                ) : null}
            </div>
        );
    }

    closeModal = () => {
        this.setState({modal: ''});
    };

    tryToSpeak = (text: string) => (event?: any) => {
        const {voice, showStr, ind} = this.state;
        let fromPopup = false;

        if (event && event.target.dataset.ind && ind !== event.target.dataset.ind) {
            return this.show({target: {tagName: 'DIV', dataset: event.target.dataset}}, true);
        }

        if (showStr) {
            text = this.getStr(showStr);
            fromPopup = true;
        }

        const subs = getSubs();
        const locale = getLocales(subs[fromPopup ? 1 : 0]);

        if (voice || locale) {
            return speak(text, locale);
        } else {
            this.voiceSetting(event);
        }
    };

    voiceSetting = (e: any) => {
        e && e.preventDefault();
        this.setState({modal: POPUP_SETTINGS});
    };

    voiceSettingSave = (newSettings: ISettings, force = false) => {
        const {voice, rate, pitch, volume} = newSettings;
        let langOverride: any = {};
        let isLangOverride = false;
        if (force) {
            if (typeof newSettings.langs !== 'undefined') {
                isLangOverride = true;
                langOverride.langs = newSettings.langs;
            }
        } else {
            if (this.state.voice === voice || (!voice && this.state.voice)) {
                return this.closeModal();
            }
        }
        const oldSettings = getSettings();
        Storage.setJ(LANG_SUBS_SETTINGS, {
            ...oldSettings,
            ...langOverride,
            voice,
            rate,
            pitch,
            volume,
        });
        this.setState({modal: '', voice, rate, pitch, volume}, () => {
            if (isLangOverride) {
                addLanguages();
            }
        });
    };
}

export default Index;
