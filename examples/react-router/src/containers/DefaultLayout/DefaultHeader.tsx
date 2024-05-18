import React, {SyntheticEvent} from 'react';

const DefaultHeader = () => {
    const [showPopup, setPopup] = React.useState(false)
    const togglePopup = (e: SyntheticEvent, show = true) => {
        e.preventDefault();
        setPopup(show);
    };
    const d = new Date(__BUILD__);

    return (
        <>
            <div className="navbar">
                <div className="wrapper">
                    <a href="" onClick={togglePopup}>
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
                            onClick={e => togglePopup(e, false)}
                        >
                            Close
                        </a>
                        <h1>Greetings!</h1>
                        <div>
                            <div>This is an offline timer</div>
                            <div>Code is open
                                <div>
                                    <a href="https://github.com/albertincx/timer-react">
                                        https://github.com/albertincx/timer-react
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
                                <small>Last update time: {`${d.toDateString()} ${d.toLocaleTimeString()}`}</small>
                            </p>
                            <a
                                href=""
                                title="Close"
                                className="modal-close bottom"
                                onClick={e => togglePopup(e, false)}
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
