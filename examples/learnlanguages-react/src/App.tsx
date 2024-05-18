import 'regenerator-runtime/runtime';
import React from 'react';

import DefaultLayout from './containers/DefaultLayout/DefaultLayout';
import ReloadPrompt from './Reload'
import './main.css';

const App = () => {
    return (
        <>
            <DefaultLayout />
            <ReloadPrompt />
        </>
    )
}

export default App;
