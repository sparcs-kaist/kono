import React, { useState, useEffect } from 'react';
import { NoticePanelDesktop, NoticePanelMobile } from 'components/landing';
import * as PostAPI from 'api/post';
import Text from 'res/texts/NoticePanel.text.json';
import { useLanguages, useFetch, useWindowDimension } from 'lib/hooks';

const NOTICE_PAGINATION = 8;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const { width } = useWindowDimension();

    const showDesktopLayout = width >= 800;

    const [
        numNotices, 
        fetchNumNotices, 
        , // isLoading
        isErrorNumNotices,
        ,
    ] = useFetch(0);

    const [
        notices,
        fetchNotices,
        , // isLoading
        isErrorNotices,
        NoticesErrorHandler,
    ] = useFetch([]);

    const [text] = useLanguages(Text);

    useEffect(() => {
        fetchNumNotices(PostAPI.count, [], data => data.notice);
    }, [fetchNumNotices]);

    /* Fetch new page when currentPage updates */
    useEffect(() => {
        fetchNotices(PostAPI.list, [{
            params: {
                filter_type: 'notice',
                start_index: (currentPage - 1) * NOTICE_PAGINATION,
                max_size: NOTICE_PAGINATION
            }
        }]);
    }, [fetchNotices, currentPage]);

    const numPages = Math.max(1, numNotices / NOTICE_PAGINATION);

    const isError = isErrorNumNotices || isErrorNotices;
    const ErrorHandlerComponent = NoticesErrorHandler;

    return showDesktopLayout ? (
        <NoticePanelDesktop
            notices={notices}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
        />
    ) : (
        <NoticePanelMobile
            notices={notices}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
        />
    )
}