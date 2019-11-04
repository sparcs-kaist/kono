import React from 'react';
import styles from '../styles/RoomLegendPanel.module.scss';
import { useSelector } from 'react-redux';
import classnames from '../lib/classnames';
import MaterialIcon from './MaterialIcon';
import Spinner from './Spinner';
import Text from '../res/texts/RoomLegendPanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

export default ({ setHighlight, isLoadingRooms, refreshRooms, lastUpdatedTime }) => {

    const text = useLanguages(Text);
    const language = useSelector(state => state.config.language);

    const onMouseEnter = (legend) => () => setHighlight(legend);
    const onMouseLeave = () => setHighlight('none');
    const showRefreshButton = !isLoadingRooms;
    const showLoadingBanner = isLoadingRooms;

    const LegendLabel = ({ labelName }) => (
        <div className={styles.RoomLegendPanel__row}
                onMouseEnter={onMouseEnter(labelName)}
                onMouseLeave={onMouseLeave}
        >
            <div className={classnames([
                    styles.RoomLegendPanel__square,
                    styles[`RoomLegendPanel__${labelName}`]
                ])} />
            <div className={classnames([
                    styles.RoomLegendPanel__label,
                    styles.RoomLegendPanel__text
                ])}>
                { text[labelName] }
            </div>
        </div>
    )

    return (
        <div className={styles.RoomLegendPanel}>
            <LegendLabel labelName="filled" />
            <LegendLabel labelName="empty"  />
            <LegendLabel labelName="null"   />
            {
                showRefreshButton && (
                    <div className={classnames([
                            styles.RoomLegendPanel__row,
                            styles.RoomLegendPanel__refresh
                        ])}
                        onClick={refreshRooms}
                    >
                        <div className={styles.RoomLegendPanel__square}>
                            <MaterialIcon md24>refresh</MaterialIcon>
                        </div>
                        <div className={styles.RoomLegendPanel__text}>
                            { text.refresh }: { new Date(lastUpdatedTime).toLocaleTimeString(language) }
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