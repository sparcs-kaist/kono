import React, { useState, useEffect } from 'react';
import { ResponsiveComponent } from 'components/layout';
import { NoticePanelDesktop, NoticePanelMobile } from 'components/landing';
import * as PostAPI from 'api/post';
import Text from 'res/texts/NoticePanel.text.json';
import { useLanguages, useFetch, useWindowDimension } from 'lib/hooks';

const NOTICE_PAGINATION = 8;

export default () => {

    const [currentPage, setCurrentPage] = useState(1);
    const { isDesktop } = useWindowDimension();

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

    const setCurrentPageWithSideEffect = (value) => {
        setCurrentPage(value);
        fetchNotices(
            PostAPI.list, 
            [{
                params: {
                    filter_type: 'notice',
                    start_index: (value - 1) * NOTICE_PAGINATION,
                    max_size: NOTICE_PAGINATION
                }
            }]
        );
    };

    useEffect(() => {
        const fetchInitialNotices = () => {
            setCurrentPage(1);
            fetchNotices(
                PostAPI.list, 
                [{
                    params: {
                        filter_type: 'notice',
                        max_size: NOTICE_PAGINATION
                    }
                }]
            );
        };
        setNoticeList([]);
        fetchInitialNotices();
    }, [isDesktop, fetchNotices])

    useEffect(() => {
        setNoticeList(noticeList => noticeList.concat(notices));
    }, [notices])

    const transcriptNotice = ({ title_kr, title_en, ...rest }) => ({
        title: (title_kr && title_en) 
            ? (language === 'kr' ? title_kr : title_en) 
            : (title_kr || text.null_title),
        ...rest
    });
    const transcriptedNotices = notices.map(transcriptNotice);
    const transcriptedNoticeList = noticeList.map(transcriptNotice);
    const _notices = isDesktop ? transcriptedNotices : transcriptedNoticeList;

    const numPages = Math.max(1, numNotices / NOTICE_PAGINATION);

    const isError = isErrorNumNotices || isErrorNotices;
    const ErrorHandlerComponent = NoticesErrorHandler;

    return (
        <ResponsiveComponent
            DesktopComponent={NoticePanelDesktop}
            MobileComponent={NoticePanelMobile}
            notices={_notices}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPageWithSideEffect}
            isError={isError}
            ErrorHandler={ErrorHandlerComponent}
            text={text}
        />
    )
}