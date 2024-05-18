import {StorageFile} from "./types";
import {franc} from "franc";

const timesAll = /([0-9]+):([0-9]+):([0-9]+)[,.]([0-9]+)/g;
const times = /([0-9]+):([0-9]+):([0-9]+)[,.]([0-9]+)/;
const SEP = /\n[0-9]{1,6}\n/;
const SEP2 = /\n[0-9]{1,6}?\s\n/;
const SEP3 = /\r\n/;
const FONT_REGEX = new RegExp('<' + '(font|i)' + '[^><]*>|<.' + '(font|i)' + '[^><]*>', 'g');

const CUSTOM_SEP = '[^^]';

export function getSep(_sep: string) {
    return _sep ? _sep : SEP;
}

function getSec(str: string) {
    const s = str.match(timesAll);
    if (!s) return 0;
    const dates = [];
    if (s.length) {
        const d = new Date();
        const t: number[] | undefined = s[0].match(times)?.map(Number);
        if (t) {
            d.setHours(Number(t[1]), t[2], t[3], t[4]);
        }
        dates.push(d);
    }
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    dates.push(d);
    return dates[0].getTime() - dates[1].getTime();
}

let ii = 0;

const seps = [SEP, SEP2, SEP3];

export function findBestSplit(str: string) {
    let sInd = 0;
    for (let s = 0; s < seps.length; s += 1) {
        const strArr = str.split(seps[s]);
        if (strArr.length > 1) {
            sInd = s;
            break;
        }
    }
    return sInd;
}

export function searchByTime(str: string, strArr: string[]) {
    const msFrom = getSec(str);
    let found = '';
    for (let i = ii; i < strArr.length; i += 1) {
        const s2 = getSec(strArr[i]);
        const msDiff = msFrom - s2;
        if (msDiff < 500) {
            ii = i;
            found = strArr[i];
            break;
        }
    }
    return found;
}

function parseAss(stored: StorageFile) {
    let strArr: string[] = stored.bstr.split('\n');
    strArr = strArr.filter(s => s.match('Dialogue: ')).map((s, ind: number) => {
        const str = s.split('Dialogue: ')[1].split(',');
        // @ts-ignore
        let [_, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text] = str;
        if (Start.match(/^0:/)) {
            Start = `0${Start}`;
        }
        if (End.match(/^0:/)) {
            End = `0${End}`;
        }
        return `\n${ind}\n${Start} --> ${End}\n${Text}\n`;
    });
    return strArr.join('');
}

const fixTags = (text: string) => text.replace(FONT_REGEX, '');

export function fixSubs(subs: any[]) {
    ii = 0;
    let [fileFrom, fileTo] = subs;

    if (fileFrom.filename.match(/\.ass$/)) {
        fileFrom.bstr = parseAss(fileFrom);
    }

    if (fileTo.filename.match(/\.ass$/)) {
        fileTo.bstr = parseAss(fileTo);
    }
    const sInd0 = findBestSplit(fileFrom.bstr);
    const sInd1 = findBestSplit(fileTo.bstr);

    fileFrom.bstr = fixTags(fileFrom.bstr);
    fileTo.bstr = fixTags(fileTo.bstr);

    let strArr = fileFrom.bstr.split(seps[sInd0]);
    if (seps[sInd0]) {
        fileFrom.sep = `${seps[sInd0]}`;
    }

    let strArr2 = fileTo.bstr.split(seps[sInd1]);

    if (strArr.length === 1) {
        strArr = fileFrom.bstr.split(SEP2);
    }
    if (strArr2.length === 1) {
        strArr = fileTo.bstr.split(SEP2);
    }

    const newStrArr2: string[] = [];
    for (let i = 0; i < strArr.length; i += 1) {
        newStrArr2.push(searchByTime(strArr[i], strArr2));
    }
    const secondFile = {
        bstr: newStrArr2.join(CUSTOM_SEP),
        filename: fileTo.filename,
        sep: CUSTOM_SEP,
        lang: fileTo.lang,
    };
    const split = splitSubs(fileFrom);
    const split2 = splitSubs(secondFile);

    if (split.length && !fileFrom.lang) {
        const str = split.slice(split.length / 2).join('').replace(/[:,->\d\n]/g, '');
        fileFrom.lang = franc(str);
    }
    if (split2.length && !secondFile.lang) {
        const str = split2.slice(split2.length / 2).join('').replace(/[:,->\d\n]/g, '');
        secondFile.lang = franc(str);
    }

    return [fileFrom, secondFile];
}

export function splitSubs(sub: StorageFile) {
    let {sep} = sub;
    if (sep && sep !== CUSTOM_SEP) {
        sep = new RegExp(sep.replace(/\//g, ''));
    }
    return sub.bstr.split(getSep(sep));
}
