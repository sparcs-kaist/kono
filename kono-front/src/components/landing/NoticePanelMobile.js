import React from 'react';
import styles from 'styles/NoticePanelMobile.module.scss';
import { PanelHeader } from 'components/landing';
import { GridPanel } from 'components/common';

const CELL_SIZE = 203;
const GAP_SIZE = 7;

export default ({
    notices,
    text,
    isError, ErrorHandler
}) => {

    const numColumns = notices.length;
    const panelWidth = CELL_SIZE * numColumns + GAP_SIZE * (numColumns - 1);

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