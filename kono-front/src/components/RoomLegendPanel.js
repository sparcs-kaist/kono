import React from 'react';
import styles from '../styles/RoomLegendPanel.module.scss';
import classnames from '../lib/classnames';
import MaterialIcon from './MaterialIcon';
import Spinner from './Spinner';
import Text from '../res/texts/RoomLegendPanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

export default ({ setHighlight, isLoadingRooms, refresh }) => {

    const text = useLanguages(Text);

    const onMouseEnter = (legend) => () => setHighlight(legend);
    const onMouseLeave = () => setHighlight('none');
    const showRefreshButton = !isLoadingRooms;
    const showLoadingBanner = isLoadingRooms;

    return (
        <div className={styles.RoomLegendPanel}>
            <div className={styles.RoomLegendPanel__row}
                onMouseEnter={onMouseEnter('filled')}
                onMouseLeave={onMouseLeave}
            >
                <div className={classnames([
                        styles.RoomLegendPanel__square,
                        styles.RoomLegendPanel__filled
                    ])} />
                <div className={classnames([
                        styles.RoomLegendPanel__label,
                        styles.RoomLegendPanel__text
                    ])}>
                    { text.filled }
                </div>
            </div>
            <div 
                className={styles.RoomLegendPanel__row}
                onMouseEnter={onMouseEnter('empty')}
                onMouseLeave={onMouseLeave}
            >
                <div className={classnames([
                        styles.RoomLegendPanel__square,
                        styles.RoomLegendPanel__empty
                    ])} />
                <div className={classnames([
                        styles.RoomLegendPanel__label,
                        styles.RoomLegendPanel__text
                    ])}>
                    { text.empty }
                </div>
            </div>
            <div className={styles.RoomLegendPanel__row}
                onMouseEnter={onMouseEnter('null')}
                onMouseLeave={onMouseLeave}
            >
                <div className={classnames([
                        styles.RoomLegendPanel__square,
                        styles.RoomLegendPanel__null
                    ])} />
                <div className={classnames([
                        styles.RoomLegendPanel__label,
                        styles.RoomLegendPanel__text
                    ])}>
                    { text.null }
                </div>
            </div>
            {
                showRefreshButton && (
                    <div className={classnames([
                            styles.RoomLegendPanel__row,
                            styles.RoomLegendPanel__refresh
                        ])}
                        onClick={refresh}
                    >
                        <div className={styles.RoomLegendPanel__square}>
                            <MaterialIcon md24>refresh</MaterialIcon>
                        </div>
                        <div className={styles.RoomLegendPanel__text}>
                            { text.refresh }
                        </div>
                    </div>
                )
            }
            {
                showLoadingBanner && (
                    <div className={classnames([
                            styles.RoomLegendPanel__row
                        ])}
                    >
                        <div className={styles.RoomLegendPanel__square}>
                            <Spinner small primary/>
                        </div>
                        <div className={styles.RoomLegendPanel__text}>
                            { text.loading }
                        </div>
                    </div>
                )
            }
        </div>
    )
}