import React, {SyntheticEvent} from 'react';

const DefaultHeader = () => {
    const [showPopup, setPopup] = React.useState(false)
    const togglePopup = (e: SyntheticEvent) => {
        e.preventDefault();
        setPopup(false);
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
                <div id="open-modal" className="modal-window">
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
