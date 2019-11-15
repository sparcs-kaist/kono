import React from 'react';
import styles from 'styles/RoomRefreshButton.module.scss';
import classnames from 'lib/classnames';
import { MaterialIcon, Spinner } from 'components/common';
import { useLanguages } from 'lib/hooks';
import Text from 'res/texts/RoomRefreshButton.text.json';

export default ({ 
    isLoading, 
    onClickRefresh, 
    lastUpdatedTime 
}) => {

    const showRefresh = !isLoading;
    const showLoading = isLoading;

    const [text, language] = useLanguages(Text);

    return (
        <>
            {
                showRefresh && (
                    <div 
                        className={classnames([
                            styles.wrapper,
                            styles.interactable
                        ])}
                        onClick={onClickRefresh}
                    >
                        <div className={styles.icon}>
                            <MaterialIcon md24>refresh</MaterialIcon>
                        </div>
                        <div className={styles.text}>
                            { text.refresh }: { new Date(lastUpdatedTime).toLocaleTimeString(language) }
                        </div>
                    </div>
                )
            }
            {
                showLoading && (
                    <div className={styles.wrapper}>
                        <div className={styles.icon}>
                            <Spinner small primary />
                        </div>
                        <div className={styles.text}>
                            { text.loading }
                        </div>
                    </div>
                )
            }
        </>
    )

}