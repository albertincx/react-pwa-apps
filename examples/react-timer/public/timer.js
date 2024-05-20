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

    updateTimerHtml(formattedHours, 'hhour');
    updateTimerHtml(getTimeStr(minutes), 'mmin');
    updateTimerHtml(getTimeStr(seconds), 'ssec');

    return `${formattedHours}${showSep(hours)}${formattedTime}`;
}

const storage = window.localStorage; //Reference to the html5 localstorage.

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

/**The Timer object. It holds the html elements pertaining to the timer and whether the timer is enabled.
 * It contains functionality to pause/play the timer, and to reset the timer. The actual counting of the timer
 * itself is carried out within the "timer-worker" script as a web worker, communicating with the Timer object.*/
function Timer() {
    this.countDown = 0;
    let isEnabled = false;

    /**Flip the current timer state and update the icon in html to represent the new state*/
    this.changeState = function (s) {
        this.countDown = s;
        reminderData.minutesPassed = 0;
        reminderData.secPassed = 0;
        reminderData.stopSound();
        if (s) {
            let mins = s / 60;
            if (s < 60) {
                mins = s / 100;
            }
            reminderData.setReminderInterval(mins);
        }

        /*Stops or starts the web worker timer counting depending on the state of this timer object*/
        isEnabled = true;
        web_worker.postMessage(["state_change", isEnabled]);
    };

    /**Tell the web worker to reset it's values for the timer, and then clear the timer within the html.
     * If the timer is still running, pause it after resetting.*/
    this.reset = function () {
        //Reset the timer.
        reminderData.stopSound();
        if (window.resetReactApp) window.resetReactApp();
        reminderData.isReminderEnabled = false;
        web_worker.postMessage(["reset"]);
        if (notificationOne) {
            notificationOne.close();
        }
        updateTimerHtml('00', 'hours');
        updateTimerHtml('00', 'minutes');
        updateTimerHtml('00', 'seconds');
    };
}

let timer = new Timer(); //Create an instance of the Timer object.

let notificationOne;

function updateTimerHtml(v, targ) {
    const el = document.getElementById(targ);
    if (el) {
        el.innerText = v;
    }
}

/**The function that takes the new values from the counted timer on the web worker and
 * updates the html. It also controls when a sound should be played to signal a reminder*/
function updateTimer(data) {
    /*data is passed when the web worker posts a message and contains a type and a value.
    data.type is either 'hh', 'mm' or 'ss' and the value is the corresponding updated value.*/
    switch (data.type) {
        case 'ss':
            updateTimerHtml(data.value, 'seconds');

            let [elapsedTime1, seconds] = document.title.split(TIMER_TITLE);
            elapsedTime1 = elapsedTime1.replace(/[^0-9:]/g, '').split(':');
            let seconds2 = getSecondsFromTime(...elapsedTime1);

            let docTitle = TIMER_TITLE;

            if (seconds2) {
                seconds2 -= 1;
                const cnd = showRemaining(seconds2);
                if (cnd) {
                    docTitle = `${cnd} ${docTitle}`;
                }
            } else {
                let elapsedTime = timer.countDown - 1;
                if (seconds) {
                    elapsedTime = +seconds
                    elapsedTime -= 1;
                }
                const cnd = showRemaining(elapsedTime);
                docTitle = cnd && elapsedTime > 0 ? `${cnd} ${TIMER_TITLE}${elapsedTime}` : TIMER_TITLE;
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
            break;
    }

    /*If the time passed has reached the set interval, play a reminder sound and reset the time passed
    to be checked again*/
    if (reminderData.intervalHasPassed()) {
        timer.reset();
        reminderData.sound.play();
        reminderData.minutesPassed = 0;
        reminderData.secPassed = 0;

        if (canUseNotifications && isNotifyOn) {
            const min = timer.countDown <= 60 ? `${timer.countDown} sec` :  `${Math.floor(timer.countDown / 60)} min`
            const body = `Times ${min} is up!`;
            const title = 'Times up!';
            try {
                notificationOne = new Notification(title,
                    {
                        icon: "icon-144x144.png",
                        silent: true,
                        body,
                    });
                notificationOne.onclose = () => {
                    reminderData.stopSound();
                }
                notificationOne.onclick = () => {
                    notificationOne.close();
                }
            } catch (e) {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification(title, {
                        body: body,
                        data: {
                            cnt: timer.countDown,
                        },
                        actions: [
                            {
                                action: 'coffee-action',
                                title: 'Stop',
                                type: 'button',
                                // icon: '/images/demos/action-1-128x128.png',
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
    this.minutesPassed = 0;
    this.secPassed = 0;

    this.reminderInterval = 0;

    this.isReminderEnabled = false;

    /**Sets the hours and minutes of the timer, and takes an optional parameter which
     * will be true when the reminder interval is being loaded from local storage, to avoid
     * re-setting the local storage with the same value.*/
    this.setReminderInterval = function (minutes, fromStorage) {
        fromStorage = fromStorage || false;

        this.reminderInterval = toFix(minutes);
        //If no reminder is set, disable the timer.
        this.isReminderEnabled = !(this.reminderInterval === 0);
        /*If the data isn't from local storage, set the local storage to the current reminder interval*/
        if (!fromStorage) {
            storage.setItem("interval", this.reminderInterval.toString());
        }
    }

    /**If reminders are enabled and the hours and minutes passed is the same as
     * the set interval, return true.*/
    this.intervalHasPassed = function () {
        if (!this.isReminderEnabled) return false;

        let remMinutes = toFix(this.reminderInterval);
        this.minutesPassed = Math.floor(this.secPassed / 60);

        remMinutes = remMinutes >= 1 ? remMinutes * 60 : remMinutes * 100;

        // console.log('this.minutesPassed = ', this.minutesPassed, this.secPassed)
        // console.log('this.secPassed = ', this.secPassed)
        // console.log('this.reminderInterval = ', this.reminderInterval, remMinutes)

        return this.secPassed >= remMinutes;
    }

    /**Gets called when the app is first loaded and the Reminder object is created.
     * is found. If there is local storage for the interval, it will grab that data and set
     * the current reminder interval.*/
    if (storage.getItem("interval") === null || storage.getItem("interval") === undefined) {
        this.setReminderInterval(0);
    } else {
        let locallyStoredInterval = storage.getItem("interval");

        this.setReminderInterval(locallyStoredInterval, true);
    }
}

let reminderData = new Reminder(); //Create the instance of Reminder()

window.safTimerBtn = (s) => timer.changeState(s);

window.safTimerResetBtn = () => timer.reset();

window.addEventListener("focus", function (e) {
    reminderData.stopSound();
    if (notificationOne) {
        notificationOne.close()
    }
}, false);

/*-----------------------:WEB WORKERS-----------------------*/
let web_worker;

/**If web workers are supported, create a new one that utilises "timer-worker"
 * and store it inside of web_worker. Setup an event listener that is triggered when
 * postMessage() is called from within "timer-worker" This event listener will call updateTimer(),
 * passing in the data received from postMessage() which should only contain a type and a value.*/
function startBackgroundProcess() {
    if (typeof (Worker) !== "undefined") {
        if (typeof (web_worker) == "undefined") {
            web_worker = new Worker("timer-process.js");
        }
        web_worker.onmessage = function (event) {
            updateTimer(event.data);
        };
    }
}

/*-----------------------:LOCAL STORAGE AND INITIALISATION-----------------------*/

/**Is called when app.js is first loaded.*/
function init() {
    startBackgroundProcess(); //Start the web worker.

    //If no local storage exists for the timer.
    if (storage.getItem("ss") === null || storage.getItem("ss") === undefined) {
        /**Store the timer values to localStorage once initially so retrieval
         * doesn't ever return null or undefined in the case of a timer not
         * being recently saved to local storage.*/
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
            parseInt(ss),
        ]);
    }

    /**If the user closes the page in any shape or form, save the current timer values to local storage.*/
    window.addEventListener("beforeunload", function () {
        return null;
    });
}

init();
if (location.hostname === 'localhost') {
    web_worker.postMessage(["state_step", 1]);
}

window.chgStepTimer = (s) => {
    web_worker.postMessage(["state_step", parseInt(s)]);
};
