import React, { useState, Fragment } from 'react';
import styles from 'styles/RoomStatePanelDesktop.module.scss';
import { RoomDiscoBall } from 'components/room';
import SVGPathsEmpty from 'res/icons/room-empty.json';
import SVGPathsFilled from 'res/icons/room-filled.json';
import Text from 'res/texts/RoomStatePanel.text.json';
import classnames from 'lib/classnames';
import { useLanguages } from 'lib/hooks';

function formatState(state) {
    if (state === 0)
        return 'empty';
    if (state === 1)
        return 'filled';
    return 'null';
}

function state2path(state) {
    if (state === 0)
        return SVGPathsEmpty;
    if (state === 1)
        return SVGPathsFilled;
    return SVGPathsFilled;
}

function roomNumber2text(room_number) {
    return String.fromCharCode('\u278A'.charCodeAt() + room_number - 1);
}

const ROOM_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

export default ({ rooms, highlight }) => {

    const [hover, setHover] = useState(null);
    const [text, language] = useLanguages(Text);

    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { state } = room || {};
        const stateType = formatState(state);
        
        const isHovered = (hover === room_idx);

        const onMouseOver = room && (() => setHover(room_idx));
        const onMouseOut = room && (() => setHover(null));

        const showHighlight = (highlight === stateType) || ( (state !== 0) && isHovered );
        const showAnimation = (state === 0) && isHovered;

        return (
            <Fragment key={`room-fragment-${room_idx}`}>
                <svg
                    className={classnames([
                        styles.room_svg,
                        styles[`room_${stateType}`],
                        showHighlight && styles.room_highlight,
                        showAnimation && styles.room_filled_animation
                    ])} 
                >
                    <path
                        d={state2path(state).path[room_idx]}
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                    />
                    {
                        isHovered && <text>
                            <tspan 
                                className={classnames([showAnimation && styles.textEffect])}
                                x={state2path(state).pos[room_idx].x}
                                y={(state === 0)? state2path(state).pos[room_idx].y + 20 : state2path(state).pos[room_idx].y - 5}
                                fontSize="16"
                            >
                                {
                                    language === 'kr'
                                    ? `${roomNumber2text(room_idx)}번 방`
                                    : `Room ${roomNumber2text(room_idx)}`
                                }
                            </tspan>
                            <tspan
                                className={showAnimation && styles.textEffect}
                                x={state2path(state).pos[room_idx].x}
                                y={(state === 0)? state2path(state).pos[room_idx].y + 45 : state2path(state).pos[room_idx].y + 20}
                                fontSize="20"
                            >
                                { text[stateType] }
                            </tspan>
                        </text>
                    }
                </svg>
                {
                    showAnimation && <RoomDiscoBall
                        key={`room-discoball-${room_idx}`}
                        x={SVGPathsEmpty.discoBallPos[room_idx].x}
                        y={SVGPathsEmpty.discoBallPos[room_idx].y}
                    />
                }
            </Fragment>
        );

    };

    return (
        <div 
            className={styles.RoomStatePanelDesktop}
        >
            {
                ROOM_NUMBERS.map(i => roomComponents(i))
            }
        </div>
    );

}
