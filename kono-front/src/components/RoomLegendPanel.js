import React from 'react';
import styles from '../styles/RoomLegendPanel.module.scss';
import classnames from '../lib/classnames';
import Text from '../res/texts/RoomLegendPanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

export default () => {

    const text = useLanguages(Text);

    return (
        <div className={styles.RoomLegendPanel}>
            <div className={styles.RoomLegendPanel__row}>
                <div className={
                    classnames([
                        styles.RoomLegendPanel__square,
                        styles.RoomLegendPanel__empty
                    ])} />
                <div className={styles.RoomLegendPanel__text}>
                    { text.empty }
                </div>
            </div>
            <div className={styles.RoomLegendPanel__row}>
                <div className={
                    classnames([
                        styles.RoomLegendPanel__square,
                        styles.RoomLegendPanel__filled
                    ])} />
                <div className={styles.RoomLegendPanel__text}>
                    { text.filled }
                </div>
            </div>
            <div className={styles.RoomLegendPanel__row}>
                <div className={
                    classnames([
                        styles.RoomLegendPanel__square,
                        styles.RoomLegendPanel__null
                    ])} />
                <div className={styles.RoomLegendPanel__text}>
                    { text.null }
                </div>
            </div>
        </div>
    )
}