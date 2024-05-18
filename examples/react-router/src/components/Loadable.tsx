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

type LazyType = () => Promise<{default: React.FunctionComponent | React.ComponentClass}>;

const loadable = (lazyIndex: LazyType) => {
    const Lc = lazy(lazyIndex);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (props) => (
        <Suspense fallback={<Loader />}>
            <Lc {...props} />
        </Suspense>
    );
};

export default (lazyIndex: LazyType) => loadable(lazyIndex);
