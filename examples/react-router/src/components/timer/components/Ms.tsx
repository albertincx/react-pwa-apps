import * as React from "react";
import {useRef, useEffect} from "react";
import MobileSelect, {CustomConfig} from "mobile-select";

type MSProps = {
    config: Omit<CustomConfig, "trigger">;
    placeholder?: string;
    children?: JSX.Element;
};
export default function MsComponent(props: MSProps) {
    const triggerRef = useRef(null);
    const instanceRef = useRef<React.RefObject<null>>(null);

    useEffect(() => {
        if (!instanceRef.current) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            instanceRef.current = new MobileSelect({
                ...props.config,
                trigger: (triggerRef.current as unknown) as HTMLElement,
                triggerDisplayValue: !props.children,
            });
        }

        return () => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            instanceRef?.current.destroy();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            instanceRef.current = null;
        };
    }, []);

    return (
        <div>
            <div className="ms-default-trigger btn" ref={triggerRef}>
                {props.children || props.placeholder || "Select custom time"}
            </div>
        </div>
    );
}
