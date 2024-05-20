import React, {SyntheticEvent} from 'react';

const crzyInit = location.hostname === 'localhost' ? 1 : 1000

const DefaultHeader = () => {
    const [showPopup, setPopup] = React.useState(false)
    const [crzy, setCrzy] = React.useState(crzyInit);

    const togglePopup = (e: SyntheticEvent) => {
        e.preventDefault();
        setPopup(false);
    };

    const handleCrzy = (e: SyntheticEvent) => {
        e.preventDefault();
        const newCrzy = crzy === 1 ? 1000 : 1;
        window.chgStepTimer(newCrzy);
        setCrzy(newCrzy);
    };

    const show = (e: SyntheticEvent) => {
        e.preventDefault();
        setPopup(true);
    }
    const d = new Date(__BUILD__);

    return (
        <>
            <div className="navbar">
                <div className="wrapper">
                    <a href="" onClick={show}>
                        About
                    </a>
                </div>
            </div>
            {showPopup ? (
                <div className="modal-window">
                    <div>
                        <a
                            href=""
                            title="Close"
                            className="modal-close"
                            onClick={togglePopup}
                        >
                            Close
                        </a>
                        <h1>Greetings!</h1>
                        <div>
                            <div>This is an offline timer</div>
                            <div>Web site <a href="https://timer.safiullin.io/">https://timer.safiullin.io/</a></div>
                            <div>Code is open
                                <div>
                                    <a href="https://github.com/albertincx/react-pwa-apps">
                                        https://github.com/albertincx/react-pwa-apps
                                    </a>
                                </div>
                            </div>
                            <p>
                                <small>Support</small>
                            </p>
                            <p>
                                <a href="https://safiullin.com" target="_blank">
                                    My website
                                </a>
                            </p>
                            <p>
                                <small>Update time: {`${d.toDateString()} ${d.toLocaleTimeString()}`}</small>
                            </p>
                            {window.mobileCheck() && (
                                <p className="red">
                                    !Important: It is not working on mobile phones! Sorry
                                    <br/>
                                    Open me on PC
                                    <a href="https://timer.safiullin.io/">https://timer.safiullin.io/</a>
                                </p>
                            )}
                            <p>
                                {!!location.hostname.match('localhost') && (
                                    <button type="button" onClick={handleCrzy}>
                                        Crazy timer is {`${crzy === 1 ? 'On' : 'Off'}`}
                                    </button>
                                )}
                            </p>
                            <a
                                href=""
                                title="Close"
                                className="modal-close bottom"
                                onClick={togglePopup}
                            >
                                Close
                            </a>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

export default DefaultHeader;
