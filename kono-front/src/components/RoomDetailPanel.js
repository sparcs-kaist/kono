import React from 'react';
import styles from '../styles/RoomDetailPanel.module.scss';
import classnames from '../lib/classnames';
import useLanguages from '../lib/hooks/useLanguages';

export default ({ x = 0, y = 0, room }) => {

    const { room_number, state, timestamp } = room || {};
    const date = new Date(timestamp);

    const RoomNumberComponent = useLanguages({
        kr: () => (
            <>
                <span className={classnames([
                    styles.RoomDetailPanel__large,
                    styles.RoomDetailPanel__highlight
                ])}>
                    { room_number }
                </span>
                <span>
                    번 방
                </span>
            </>
        ),
        en: () => (
            <>
                <span>
                    Room #
                </span>
                <span className={classnames([
                    styles.RoomDetailPanel__large,
                    styles.RoomDetailPanel__highlight
                ])}>
                    { room_number }
                </span>
            </>
        )
    });

    const RoomStateComponent = useLanguages({
        kr: () => (
            <>
                <span>{ '현재 ' }</span>
                <span className={classnames([
                    (state === 1) && styles.RoomDetailPanel__highlight_on,
                    (state === 0) && styles.RoomDetailPanel__theme_background
                ])}>
                    {
                        (state === 1) ? '사용 중' : '사용 가능'
                    }
                </span>
            </>
        ),
        en: () => (
            <>
                <span>{ `Now ` }</span>
                <span className={classnames([
                    (state === 1) && styles.RoomDetailPanel__highlight_on,
                    (state === 0) && styles.RoomDetailPanel__theme_background
                ])}>
                    {
                        (state === 1) ? 'in use' : 'empty'
                    }
                </span>
            </>
        )
    });

    const RoomTimestampComponent = useLanguages({
        kr: () => (
            <>
                <span>{ '마지막 갱신 시각: ' }</span>
                <span>{ date.toLocaleTimeString('ko-KR') }</span>
            </>
        ),
        en: () => (
            <>
            <span>{ 'Last updated: ' }</span>
            <span>{ date.toLocaleTimeString('en-US') }</span>
            </>
        )
    })

    return (
        <div 
            className={styles.RoomDetailPanel}
            style={{
                top: y,
                left: x
            }}
        >
            <div className={classnames([
                styles.RoomDetailPanel__row
            ])}>
                <RoomNumberComponent />
            </div>
            <div className={classnames([
                styles.RoomDetailPanel__row
            ])}>
                <RoomStateComponent />
            </div>
            <div className={classnames([
                styles.RoomDetailPanel__row,
                styles.RoomDetailPanel__timestamp
            ])}>
                <RoomTimestampComponent />
            </div>
        </div>
    )

}