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
    const [noticeList, setNoticeList] = useState([]);

    const [text, language] = useLanguages(Text);

    useEffect(() => {
        fetchNumNotices(PostAPI.count, [], data => data.notice);
    }, [fetchNumNotices]);

    /* Fetch new page when currentPage updates.
     * In desktop layout, new notices replaces the old notices.
     * In mobile layout, new notices are appended to old notices.
     */

    useEffect(() => {
        fetchNotices(
            PostAPI.list, 
            [{
                params: {
                    filter_type: 'notice',
                    start_index: (currentPage - 1) * NOTICE_PAGINATION,
                    max_size: NOTICE_PAGINATION
                }
            }]
        );
    }, [fetchNotices, currentPage]);

    useEffect(() => {
        if (showDesktopLayout)
            setNoticeList(notices);
        else
            setNoticeList(noticeList => noticeList.concat(notices));
    }, [showDesktopLayout, notices]);

    const transcriptNotice = ({ title_kr, title_en, ...rest }) => ({
        title: (title_kr && title_en) ? (language === 'kr' ? title_kr : title_en) : (title_kr || text.null_title),
        ...rest
    });
    const transcriptedNoticeList = noticeList.map(transcriptNotice);

    const numPages = Math.max(1, numNotices / NOTICE_PAGINATION);

    const isError = isErrorNumNotices || isErrorNotices;
    const ErrorHandlerComponent = NoticesErrorHandler;

    return showDesktopLayout ? (
        <NoticePanelDesktop
            notices={transcriptedNoticeList}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
        />
    ) : (
        <NoticePanelMobile
            notices={transcriptedNoticeList}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
        />
    )
}