import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useFetch from '../lib/hooks/useFetch';

export default ({ url }) => {

    const [
        innerHTML,
        fetchInnerHTML,
        InnerHTMLErrorHandler,
        showInnerHTMLErrorHandler
    ] = useFetch(
        '',
        {
            fn: axios.get,
            args: [ url ]
        }
    );

    useEffect(() => {
        fetchInnerHTML();
    }, [url]);

    return (
        <>
        {
            <InnerHTMLErrorHandler showErrorText/>
        }
        {
            !showInnerHTMLErrorHandler && <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
        }
        </>
    );

}