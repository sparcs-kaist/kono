import React from 'react';
import styles from 'styles/PanelFooter.module.scss';
import classnames from 'lib/classnames';
import { MaterialIcon } from 'components/common';

const MAX_PAGES_SHOW = 5;

export default ({ 
    currentPage, 
    numPages,
    onClickPage
}) => {

    if (!currentPage || !numPages)
        return null;

    const startPage = Math.max(1, currentPage - Math.floor(.5 * MAX_PAGES_SHOW));
    const endPage   = Math.min(numPages, startPage + MAX_PAGES_SHOW - 1);
    const pages     = [...Array(endPage - startPage + 1).keys()].map(x => x + startPage);

    return (
        <div className={styles.PanelFooter}>
            { 
                startPage > 1 ? (
                    <div
                        className={styles.PanelFooter__link}
                        onClick={() => onClickPage(currentPage - 1)}
                    >
                        <MaterialIcon md20>keyboard_arrow_left</MaterialIcon>
                    </div>
                ) : null
            }
            {
                pages.map((x) => {
                    return (
                        <div
                            className={classnames([
                                styles.PanelFooter__page, 
                                (x !== currentPage) && styles.PanelFooter__link
                            ])}
                            key={`panel-footer-${x}`}
                            onClick={x === currentPage ? null : () => onClickPage(x)}>
                            { x }
                        </div>
                    )
                })
            }
            {
                endPage < numPages ? (
                    <div
                        className={styles.PanelFooter__link}
                        onClick={() => onClickPage(currentPage + 1)}
                    >
                        <MaterialIcon md20>keyboard_arrow_right</MaterialIcon>
                    </div>
                ) : null
            }
        </div>
    )
}
