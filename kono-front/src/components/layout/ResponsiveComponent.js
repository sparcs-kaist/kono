import React from 'react';
import { useWindowDimension } from 'lib/hooks';

export default ({ DesktopComponent, MobileComponent, threshold, ...rest }) => {

    const { width, isDesktop } = useWindowDimension();
    const showDesktop = threshold ? (width >= threshold) : isDesktop;

    return (
        <>
            {
                showDesktop
                ? <DesktopComponent { ...rest }/>
                : <MobileComponent { ...rest }/>
            }
        </>
    )

}