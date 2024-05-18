import React, {useState} from 'react';
import Storage from "../../../utils/storage";
import {langBS_history} from "../consts";
import File from "./File";

const History: React.FC<any> = ({upload}) => {
    const [data, setData] = useState(Storage.getJ(langBS_history));

    const clear = (ind: number, restore = false) => () => {
        let subs;
        if (restore) {
            subs = data[ind];
        }

        let newHistory = [...data.filter((_: any, ind1: number) => ind1 !== ind)];
        Storage.setJ(langBS_history, newHistory);
        if (restore) {
            if (subs) {
                upload(subs, true);
            }
        } else {
            setData(newHistory);
        }
    };

    if (!data || !data.length) {
        return null;
    }

    const renderFile = (subsArray: any[], ind: number) => {
        if (!Array.isArray(subsArray)) {
            return;
        }

        return (
            <div className="file" key={`subs${ind}` + 1}>
                {subsArray && (
                    <File
                        subs={subsArray}
                        restoreFunc={clear(ind, true)}
                        deleteFunc={clear(ind)}
                    />
                )}
            </div>
        )
    }

    return (
        <div className='history'>
            <p>History</p>
            <div>
                <div>
                    <div>
                        {data && data.map((subsArray: any, ind: number) => renderFile(subsArray, ind))}
                    </div>
                    <br/>
                </div>
            </div>
        </div>
    );
}

export default History;
