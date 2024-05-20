import React, {Component} from 'react';

import {StorageManager} from '../../utils/storage.ts';

import Loadable from '../../components/Loadable';

import DefaultHeader from './DefaultHeader';

const AppLoadable = Loadable(() => import('../../components/timer'));

const sbWidth = StorageManager.get('sbWidth', '');

interface Props {
    someProp?: string
}

interface State {
    sbWidth: string;
}

class DefaultLayout extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {sbWidth};
    }

    render(): React.ReactElement {
        let {sbWidth: width} = this.state;
        if (window.screen.width < 500) width = '';

        return (
            <>
                <DefaultHeader/>
                <div className="app-body">
                    <main
                        className="main"
                        id="main"
                        style={width ? {marginLeft: width} : {}}
                    >
                        <AppLoadable />
                    </main>
                </div>
            </>
        );
    }
}

export default DefaultLayout;
