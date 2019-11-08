import React, { useEffect } from 'react';
import axios from 'axios';
import useFetch from '../../lib/hooks/useFetch';

export default ({ url }) => {

    const [
        innerHTML,
        fetchInnerHTML,
        , // isLoading
        isErrorInnerHTML,
        InnerHTMLErrorHandler
    ] = useFetch('');

    useEffect(() => {
        fetchInnerHTML(axios.get, [url]);
    }, [fetchInnerHTML, url]);

    return (
        <>
        {
            <InnerHTMLErrorHandler showErrorText/>
        }
        {
            !isErrorInnerHTML && <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
        }
        </>
    );

}