import React from 'react';
import styles from '../styles/PanelFooter.module.scss';
import { ReactComponent as LeftArrowIcon } from '../res/icons/keyboard-arrow-left.svg';
import { ReactComponent as RightArrowIcon } from '../res/icons/keyboard-arrow-right.svg';

export default ({ 
    currentPage, pagination, lastPage,
    onClickPage
}) => {

    if (!currentPage || !pagination || !lastPage)
        return null;

    const startPage = Math.max(1, currentPage - Math.floor(.5 * pagination));
    const endPage   = Math.min(lastPage, startPage + pagination - 1);
    const pages     = [...Array(endPage - startPage + 1).keys()].map(x => x + startPage);

    return (
        <div className={styles.PanelFooter}>
            { 
                startPage > 1 ? (
                    <LeftArrowIcon
                        className={styles.PanelFooter__link}
                        onClick={() => onClickPage(currentPage - 1)}
                    />
                ) : null
            }
            {
                pages.map((x) => {
                    return (
                        <div
                            className={[styles.PanelFooter__page, x !== currentPage && styles.PanelFooter__link]
                                .filter(e => !!e)
                                .join(' ')}
                            key={`panel-footer-${x}`}
                            onClick={x === currentPage ? null : () => onClickPage(x)}>
                            { x }
                        </div>
                    )
                })
            }
            {
                endPage < lastPage ? (
                    <RightArrowIcon
                        className={styles.PanelFooter__link}
                        onClick={() => onClickPage(currentPage + 1)}
                    />
                ) : null
            }
        </div>
    )
}
