/*Values that are incremented each time the timer counts, they are only
used within this file.*/
let ss = 0;
let mm = 0;
let hh = 0;

/**Local copy of the apps.js::Timer.isEnabled variable. Is updated via web_worker.postMessage()
 when the Timer copy changes*/
let isEnabled = false;
let setTimeoutVar;
/*Wraps the type and data inside an object for readability*/
function timerPostData(type, value) {
    return {
        type: type,
        value: value
    };
}

/**Gets called every second and will update a timer. Each time a value changes on the
 * timer, app.js is notified via postMessage(), where it will receive the value that has
 * been updated and its new value. app.js will, via updateTimer() then make the relevant
 * changes.*/
function timer() {
    if (isEnabled) {
        ss += 1;
        if (ss >= 60) {
            ss = 0;
            mm += 1;

            if (mm >= 60) {
                hh += 1;
                mm = 0;
                postMessage(timerPostData('hh', hh));
            }
            postMessage(timerPostData('mm', mm));
        }
        postMessage(timerPostData('ss', ss));
    }
    setTimeoutVar = setTimeout("timer()", 1000);
}

timer();


//Listen for events being sent to this web worker from app.js
onmessage = function (event) {
    /*When the timer on app.js changes state, update the state here.*/
    if (event.data[0] === "state_change") {
        isEnabled = event.data[1];
        if (isEnabled) {
            clearTimeout(setTimeoutVar);
            ss = 0;
            mm = 0;
            hh = 0;
            timer();
        } else {
            clearTimeout(setTimeoutVar)
            ss = 0;
            mm = 0;
            hh = 0;
        }
    }
    /*When the app is first loaded, the latest time is pushed to this web worker
    via postMessage()*/
    else if (event.data[0] === "update_from_storage") {
        hh = event.data[1];
        mm = event.data[2];
        ss = event.data[3];
    } else if (event.data[0] === "reset") {
        clearTimeout(setTimeoutVar)
        ss = 0;
        mm = 0;
        hh = 0;
    }
}

// Click and open notification
self.addEventListener('notificationclick', event => {
    console.log('Data 1', event)
    event.notification.close();
    event.waitUntil(
        clients
            .matchAll({
                type: "window",
                includeUncontrolled: true
            })
            .then((clientList) => {
                console.log('Data', clientList);
                for (const client of clientList) {
                    // if (client.url === "/" && "focus" in client) return client.focus();
                    if ("focus" in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow("/");
            }),
    );
});
