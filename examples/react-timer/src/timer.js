"use strict"; //Forces strict JS syntax.

const TIMER_TITLE = 'Timer';
let canUseNotifications = true;

const getTimeStr = (t) => `${t < 10 ? `0${t}` : t}`;
const showSep = (d) => d ? `:` : ''
const toFix = (n, s = 2) => +parseFloat(n).toFixed(s)
let isNotifyOn = false;

if ('Notification' in window) {
    Notification.requestPermission().then(function (permission) {
        isNotifyOn = permission === 'granted';
    });
}

function getSecondsFromTime(...args) {
    if (args.length < 2) return 0;

    let [h, m, s] = args;
    h = +h;
    m = +m;

    const withHours = args.length > 2;

    if (withHours) {
        s = +s;
    } else {
        let tmp = m;
        m = h;
        s = tmp
    }
    if (withHours) {
        s += h * 60 * 60;
    }
    const d = new Date;
    d.setTime(d.getTime() + (m * 60 * 60 * 1000) + (s * 60 * 1000));

    return (d.getTime() - Date.now()) / 60 / 1000;
}

function showRemaining(timeSec) {
    if (timeSec < 0) {
        return '';
    }
    let now = new Date().getTime();

    const countDownDate = new Date().getTime() + (timeSec * 1000);
    let distance = countDownDate - now;

    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const formattedHours = hours ? getTimeStr(hours) : '';
    const formattedTime = `${getTimeStr(minutes)}:${getTimeStr(seconds)}`;
    const hEl = document.getElementById('hhour');
    const hElSep = document.getElementById('hhourSep');
    if (formattedHours) {
        hEl && (hEl.style.display = 'block');
        hElSep && (hElSep.style.display = 'block');
    } else {
        hEl && (hEl.style.display = 'none');
        hElSep && (hElSep.style.display = 'none');
    }
    updateTimerHtml(formattedHours, 'hhour')
    updateTimerHtml(getTimeStr(minutes), 'mmin')
    updateTimerHtml(getTimeStr(seconds), 'ssec')
    return `${formattedHours}${showSep(hours)}${formattedTime}`;
}

const storage = window.localStorage; //Reference to the html5 localstorage.

/**The Timer object. It holds the html elements pertaining to the timer and whether the timer is enabled.
 * It contains functionality to pause/play the timer, and to reset the timer. The actual counting of the timer
 * itself is carried out within the "timer-worker" script as a web worker, communicating with the Timer object.*/
function Timer() {
    this.countDown = 0;
    let isEnabled = false;

    /**Flip the current timer state and update the icon in html to represent the new state and
     * call setAllStorage() to update the local storage timer values with the current values*/
    this.changeState = function (s) {
        this.countDown = s;
        reminderData.hoursPassed = 0;
        reminderData.minutesPassed = 0;
        reminderData.secPassed = 0;
        reminderData.stopSound();
        if (s) {
            let mins = s / 60;
            if (s < 60) {
                mins = s / 100;
            }
            reminderData.setReminderInterval(0, mins);
        }

        /*Stops or starts the web worker timer counting depending on the state of this timer object*/
        isEnabled = true;
        web_worker.postMessage(["state_change", isEnabled]);

        setAllStorage();
    };

    /**Tell the web worker to reset it's values for the timer, and then clear the timer within the html.
     * If the timer is still running, pause it after resetting and then update the local storage.*/
    this.reset = function () {
        //Reset the timer.
        reminderData.stopSound();
        reminderData.isReminderEnabled = false;
        web_worker.postMessage(["reset"]);
        if (notificationOne) {
            notificationOne.close();
        }
        updateTimerHtml('00', 'hours');
        updateTimerHtml('00', 'minutes');
        updateTimerHtml('00', 'seconds');
        setAllStorage();
    };
}

let timer = new Timer(); //Create an instance of the Timer object.

//Timer UI Events
window.safTimerBtn = (s) => {
    timer.changeState(Math.floor(s))
};

window.safTimerResetBtn = () => timer.reset();

function getTimerHtml(targ) {
    const el = document.getElementById(targ);
    if (el) {
        return el.innerText;
    }

    return ''
}

let notificationOne;
window.addEventListener("focus", function (e) {
    console.log(e);
    reminderData.stopSound();
    if (notificationOne) {
        notificationOne.close()
    }
}, false);

function updateTimerHtml(v, targ) {
    const el = document.getElementById(targ);
    if (el) {
        el.innerText = v;
    }
}

/**The function that takes the new values from the counted timer on the web worker and
 * updates the html. It also controls when a sound should be played to signal a reminder and
 * autosaves the timer in localstorage every 10 seconds.*/
function updateTimer(data) {
    /*data is passed when the web worker posts a message and contains a type and a value.
    data.type is either 'hh', 'mm' or 'ss' and the value is the corresponding updated value.*/
    switch (data.type) {
        case 'ss':
            /*If 10 seconds has passed, update the local storage*/
            if (data.value % 10 === 0) {
                setAllStorage();
            }
            updateTimerHtml(data.value, 'seconds');

            let [elapsedTime1, seconds] = document.title.split(TIMER_TITLE);
            elapsedTime1 = elapsedTime1.replace(/[^0-9:]/g, '').split(':');
            let seconds2 = getSecondsFromTime(...elapsedTime1);

            let docTitle = TIMER_TITLE;

            if (seconds2) {
                seconds2 -= 1;
                const cnd = showRemaining(seconds2);
                if (cnd) {
                    docTitle = `(${cnd}) ${docTitle}`;
                }
            } else {
                let elapsedTime = timer.countDown - 1;
                if (seconds) {
                    elapsedTime = +seconds
                    elapsedTime -= 1;
                }
                const cnd = showRemaining(elapsedTime);
                docTitle = cnd && elapsedTime > 0 ? `(${cnd}) ${TIMER_TITLE}${elapsedTime}` : TIMER_TITLE;
            }

            document.title = `${docTitle}`;

            reminderData.secPassed++;
            break;
        case 'mm':
            updateTimerHtml(data.value, 'minutes');
            reminderData.minutesPassed++;
            break;
        case 'hh':
            updateTimerHtml(data.value, 'hours');
            reminderData.hoursPassed++;
            break;
    }

    /*If the time passed has reached the set interval, play a reminder sound and reset the time passed
    to be checked again*/
    if (reminderData.intervalHasPassed()) {
        timer.reset();
        reminderData.sound.play();
        reminderData.hoursPassed = 0;
        reminderData.minutesPassed = 0;
        reminderData.secPassed = 0;

        if (canUseNotifications && isNotifyOn) {
            try {
                notificationOne = new Notification("Times up!",
                    {
                        icon: "icon-144x144.png",
                        silent: true
                    });
                notificationOne.onclose = () => {
                    reminderData.stopSound();
                }
                notificationOne.onclick = (e) => {
                    notificationOne.close();
                }
            } catch (e) {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification(`Times ${timer.countDown} up!`, {
                        body: `TIMER ${timer.countDown} is EXPIRED!`,
                        data: {
                            cnt: timer.countDown,
                        },
                        action: ['test'],
                        actions: [
                            {
                                action: 'coffee-action',
                                title: 'Coffee',
                                type: 'button',
                                icon: '/images/demos/action-1-128x128.png',
                            },
                        ],
                    });
                });
            }
        }
    }
}

/*-----------------------:REMINDERS-----------------------*/

/**The Reminder object contains the sound, the amount of time passed in hours and minutes, the interval
 * at which the reminder should be triggered and then the functionality to set the reminder interval.*/
function Reminder() {
    this.sound = new Audio("alarm-clock-short.mp3");
    this.stopSound = () => {
        this.sound.pause();
        this.sound.currentTime = 0;
    }
    /*Amount of time passed between each reminder interval*/
    this.hoursPassed = 0;
    this.minutesPassed = 0;
    this.secPassed = 0;

    /*Every [hours, minutes] the reminder should be triggered*/
    this.reminderInterval = [];

    this.isReminderEnabled = false;

    /**Sets the hours and minutes of the timer, and takes an optional parameter which
     * will be true when the reminder interval is being loaded from local storage, to avoid
     * re-setting the local storage with the same value.*/
    this.setReminderInterval = function (hours, minutes, fromStorage) {
        fromStorage = fromStorage || false;

        this.reminderInterval[0] = toFix(hours);
        this.reminderInterval[1] = toFix(minutes);
        //If no reminder is set, disable the timer.
        this.isReminderEnabled = !(this.reminderInterval[0] === 0 && this.reminderInterval[1] === 0);
        /*If the data isn't from local storage, set the local storage to the current reminder interval*/
        if (!fromStorage) {
            storage.setItem("interval", this.reminderInterval[0].toString() + "," + this.reminderInterval[1].toString());
        }
    }

    /**If reminders are enabled and the hours and minutes passed is the same as
     * the set interval, return true.*/
    this.intervalHasPassed = function () {
        if (!this.isReminderEnabled) return false;

        let remMinutes = toFix(this.reminderInterval[1]);
        let remHours = toFix(this.reminderInterval[0]);
        const hours = this.hoursPassed === remHours;
        this.minutesPassed = Math.floor(this.secPassed / 60);
        let minutes = false;

        remMinutes = remMinutes >= 1 ? remMinutes * 60 : remMinutes * 100;

        if (this.secPassed >= remMinutes) minutes = true;

        // console.log('this.hoursPassed = ', this.hoursPassed, this.minutesPassed, this.secPassed)
        // console.log('this.minutesPassed = ', this.minutesPassed, this.secPassed)
        // console.log('this.secPassed = ', this.secPassed)
        // console.log('to off = ', hours, minutes)
        // console.log('this.reminderInterval = ', this.reminderInterval[0], remMinutes)

        return hours && minutes;
    }

    /**Gets called when the app is first loaded and the Reminder object is created.
     * It sets the reminder interval to 2 hours if no local storage for the interval
     * is found. If there is local storage for the interval, it will grab that data and set
     * the current reminder interval.*/
    if (storage.getItem("interval") === null || storage.getItem("interval") === undefined) {
        this.setReminderInterval(0, 0);
    } else {
        let locallyStoredInterval = storage.getItem("interval").split(','); //Split the local storage eg. "2,30"

        this.setReminderInterval(locallyStoredInterval[0], locallyStoredInterval[1], true);
    }
}

let reminderData = new Reminder(); //Create the instance of Reminder()

/*-----------------------:WEB WORKERS-----------------------*/
let web_worker;

/**If web workers are supported, create a new one that utilises "timer-worker"
 * and store it inside of web_worker. Setup an event listener that is triggered when
 * postMessage() is called from within "timer-worker" This event listener will call updateTimer(),
 * passing in the data received from postMessage() which should only contain a type and a value.*/
function startBackgroundProcess() {
    if (typeof (Worker) !== "undefined") {
        if (typeof (web_worker) == "undefined") {
            web_worker = new Worker("timer-proccess.js");
        }
        web_worker.onmessage = function (event) {
            updateTimer(event.data);
        };
    }
}

/*-----------------------:LOCAL STORAGE AND INITIALISATION-----------------------*/

/**Sets all the stored values from the timer to the current values in the html.*/
function setAllStorage() {
    storage.setItem("hh", getTimerHtml('hours'));
    storage.setItem("mm", getTimerHtml('minutes'));
    storage.setItem("ss", getTimerHtml('seconds'));
}

/**Is called when app.js is first loaded.*/
function init() {
    startBackgroundProcess(); //Start the web worker.

    //If no local storage exists for the timer.
    if (storage.getItem("ss") === null || storage.getItem("ss") === undefined) {
        /**Store the timer values to localStorage once initially so retrieval
         * doesn't ever return null or undefined in the case of a timer not
         * being recently saved to local storage.*/
        setAllStorage();
    } else {
        /*Make the current timer values in the html equal to the locally stored values.*/
        const hh = storage.getItem("hh");
        const mm = storage.getItem("mm");
        const ss = storage.getItem("ss");
        updateTimerHtml(hh, 'hours')
        updateTimerHtml(mm, 'minutes')
        updateTimerHtml(ss, 'seconds')
        /*Tell the web worker to update it's values by the locally stored values parsed as integers.*/
        web_worker.postMessage([
            "update_from_storage",
            parseInt(hh),
            parseInt(mm),
            parseInt(ss)
        ]);
    }

    /**If the user closes the page in any shape or form, save the current timer values to local storage.*/
    window.addEventListener("beforeunload", function () {
        setAllStorage();
        return null;
    });
}

init();
