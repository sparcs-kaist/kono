import React from 'react';
import styles from 'styles/NoticePanelMobile.module.scss';
import { Link } from 'react-router-dom';
import { PanelHeader } from 'components/landing';
import { GridPanel } from 'components/common';
import { useLanguages } from 'lib/hooks';
import { ReactComponent as Background1 } from 'res/icons/notice_mobile_1.svg';
import { ReactComponent as Background2 } from 'res/icons/notice_mobile_2.svg';

const CELL_SIZE = 203;
const GAP_SIZE = 7;

export default ({
    notices,
    text,
    isError, ErrorHandler
}) => {

    const numColumns = notices.length;
    const panelWidth = CELL_SIZE * numColumns + GAP_SIZE * (numColumns - 1);

    const NoticeComponent = ({ sid, title_kr, title_en, created_time }) => {

        const titleKR = title_kr || text.null_title;
        const titleEN = title_en || titleKR || text.null_title;
        const [title] = useLanguages({ kr: titleKR, en: titleEN });
        const date = new Date(created_time);

        const titleString = title;
        const dateString = date.toLocaleString('default', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        return (
            <div className={styles.grid_item}>
                <Link to={`/post/${sid}`}>
                    {
                        (sid % 2 === 0)
                            ? <Background1 />
                            : <Background2 />
                    }
                    <div className={styles.grid_item_date}>{ dateString }</div>
                    <div className={styles.grid_item_title}>{ titleString }</div>
                </Link>
            </div>
        );

    }

    return (
        <div className={styles.NoticePanelMobile}>
            <PanelHeader title={text.title}/>
            {
                !isError && (
                    <div className={styles.grid_wrapper}>
                        <GridPanel
                            gridNumRows={1}
                            gridNumColumns={numColumns}
                            totalWidthPixels={panelWidth}
                            gridGapPixels={GAP_SIZE}
                            contentPanels={notices.map(NoticeComponent)}
                        />
                    </div>
                )
            }
            {
                <ErrorHandler height={203} showErrorText showSpinner showBackground />
            }
        </div>
    )

}