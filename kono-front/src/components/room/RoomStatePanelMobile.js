import React, { useState, useRef, useEffect } from 'react';
import styles from 'styles/RoomStatePanelMobile.module.scss';
import Text from 'res/texts/RoomStatePanel.text.json';
import classnames from 'lib/classnames';
import { useLanguages } from 'lib/hooks';

const ROOM_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

function formatState(state) {
    if (state === 0)
        return 'empty';
    if (state === 1)
        return 'filled';
    return 'null';
}

function roomNumber2text(room_number) {
    return String.fromCharCode('\u278A'.charCodeAt() + room_number - 1);
}

export default ({ rooms }) => {

    const [selected, setSelected] = useState(null);
    const [text, language] = useLanguages(Text);

    const wrapperRef = useRef();
    
    const handleClickOutside = () => { setSelected(null); };

    /* Detect tap on outside components */
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { state } = room || {};
        const stateType = formatState(state);

        const isSelected = (selected === room_idx);
        const showAnimation = isSelected && (state === 1);

        const onClick = () => { setSelected(room_idx); };

        const content = isSelected
            ? (
                <div className={styles.selected_content}>
                    <span className={styles.selected_number}>
                        {
                            language === 'kr'
                                ? `${roomNumber2text(room_idx)}번 방`
                                : `Room ${roomNumber2text(room_idx)}`
                        }
                    </span>
                    <span className={styles.selected_state}>
                        { text[stateType] }
                    </span>
                </div>
            )
            : (
                <div>
                    { room_idx }
                </div>
            );

        return (
            <div 
                className={classnames([
                    styles.item,
                    styles[`room_${stateType}`],
                    styles[`item_${room_idx}`],
                    isSelected && styles.selected,
                    showAnimation && styles.animation
                ])}
                onClick={onClick}
                key={`room_mobile_${room_idx}`}
            >
                { content }
            </div>
        )

    }

    return (
        <div className={styles.RoomStatePanelMobile}
            ref={wrapperRef}>
            <div className={styles.grid}>
                {
                    ROOM_NUMBERS.map(i => roomComponents(i))
                }
            </div>
        </div>
    )

}