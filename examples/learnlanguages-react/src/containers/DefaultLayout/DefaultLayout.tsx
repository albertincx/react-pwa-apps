import React, {Component} from 'react';

import Storage from '../../utils/storage';
import Loadable from '../../components/Loadable';

import DefaultHeader from './DefaultHeader';

const LangLoadable = Loadable(() => import('../../components/language-by-subtitles'));

const sbWidth = Storage.get('sbWidth', '');

class DefaultLayout extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {sbWidth};
    }

    render() {
        let {sbWidth: width} = this.state;
        if (window.screen.width < 500) width = '';

        return (
            <div className="app header-fixed">
                <DefaultHeader/>
                <div className="app-body">
                    <main
                        className="main"
                        id="main"
                        style={width ? {marginLeft: width} : {}}
                    >
                        <div className="container-fluid">
                            <LangLoadable />
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default DefaultLayout;
