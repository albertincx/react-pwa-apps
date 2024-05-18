import React, {lazy, Suspense} from 'react';

const Loader = () => {
    return (
        <div className="loader-wrap">
            <div className="lds-ellipsis">
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
    )
};

const loadable = (lazyIndex: any) => {
    const Lc = lazy(lazyIndex);

    return (props: any) => (
        <Suspense fallback={<Loader />}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Lc {...props} />
        </Suspense>
    );
};

export default (lazyIndex: any) => loadable(lazyIndex);
