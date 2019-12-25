import React from 'react';
import styles from 'styles/RoomLegendPanel.module.scss';
import classnames from 'lib/classnames';
import { RoomRefreshButton } from 'components/room';
import Text from 'res/texts/RoomLegendPanel.text.json';
import { useLanguages } from 'lib/hooks';

export default ({ setHighlight, isLoadingRooms, refreshRooms, lastUpdatedTime }) => {

    const [text] = useLanguages(Text);

    const onMouseEnter = (legend) => () => setHighlight(legend);
    const onMouseLeave = () => setHighlight('none');

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

    const stylesRefreshButton = {
        wrapper: styles.RoomLegendPanel__row,
        interactable: styles.RoomLegendPanel__refresh,
        icon: styles.RoomLegendPanel__square,
        text: styles.RoomLegendPanel__text
    };

    return (
        <div className={styles.RoomLegendPanel}>
            <LegendLabel labelName="filled" />
            <LegendLabel labelName="empty"  />
            <LegendLabel labelName="null"   />
            <RoomRefreshButton
                isLoading={isLoadingRooms}
                onClickRefresh={refreshRooms}
                lastUpdatedTime={lastUpdatedTime}
                styles={stylesRefreshButton}
            />
        </div>
    )
}