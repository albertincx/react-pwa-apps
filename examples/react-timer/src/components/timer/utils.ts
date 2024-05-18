import Storage from '../../utils/storage';
import {APP_SETTINGS} from './consts';
import {ISettings} from "./types";

export const floorTime = (num: number | string, sep = 60) => Math.floor(sep ? +num / sep : +num);

export const getSettings = (): ISettings => {
    return Storage.getJ(APP_SETTINGS) || {};
};

export const getRandomMs = () => Math.random();

export const getTimeStr = (t: number) => `${t < 10 ? `0${t}` : t}`;

const showSep = (d: string | number) => d ? `:` : ''

export function showRemaining(timeSec: number) {
    if (timeSec < 0) {
        return '';
    }
    let now = new Date().getTime();

    const countDownDate = new Date().getTime() + (timeSec * 1000);
    let distance = countDownDate - now;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    const formattedDays = days ? getTimeStr(days) : '';
    const formattedHours = days || hours ? getTimeStr(hours) : '';
    const formattedTime = `${getTimeStr(minutes)}:${getTimeStr(seconds)}`;

    return `${formattedDays}${showSep(days)}${formattedHours}${showSep(days || hours)}${formattedTime}`;
}
