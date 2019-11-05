import React, { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/RoomStatePanel.module.scss';
import RoomDiscoBall from './RoomDiscoBall';
import SVGPathsEmpty from '../res/icons/room-empty.json';
import SVGPathsFilled from '../res/icons/room-filled.json';
import classnames from '../lib/classnames';
import Text from '../res/texts/RoomStatePanel.text.json';
import useLanguages from '../lib/hooks/useLanguages';

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
    const text = useLanguages(Text);
    const language = useSelector(state => state.config.language);
    
    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { state } = room || {};
        const stateType = formatState(state);
        
        const isHovered = (hover === room_idx);

        const onMouseOver = room && (() => setHover(room_idx));
        const onMouseOut = room && (() => setHover(null));

        const showHighlight = (highlight === stateType) || ( (state !== 1) && isHovered );
        const showAnimation = (state === 1) && isHovered;

        return (
            <Fragment key={`room-fragment-${room_idx}`}>
                <svg
                    className={classnames([
                        styles.RoomStatePanel__room_svg,
                        styles[`RoomStatePanel__room_${stateType}`],
                        showHighlight && styles.RoomStatePanel__room_highlight,
                        showAnimation && styles.RoomStatePanel__room_filled_animation
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
                                x={state2path(state).pos[room_idx].x}
                                y={(state === 1)? state2path(state).pos[room_idx].y + 20 : state2path(state).pos[room_idx].y - 5}
                                fontSize="16"
                            >
                                {
                                    language === 'kr'
                                    ? `${roomNumber2text(room_idx)}번 방`
                                    : `Room ${roomNumber2text(room_idx)}`
                                }
                            </tspan>
                            <tspan
                                x={state2path(state).pos[room_idx].x}
                                y={(state === 1)? state2path(state).pos[room_idx].y + 43 : state2path(state).pos[room_idx].y + 18}
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
                        x={SVGPathsFilled.discoBallPos[room_idx].x}
                        y={SVGPathsFilled.discoBallPos[room_idx].y}
                    />
                }
            </Fragment>
        );

    };

    return (
        <div>
            <div 
                className={styles.RoomStatePanel} 
                width="545"
                height="604" 
                viewBox="0 0 545 604" 
                xmlns="http://www.w3.org/2000/svg"
            >
                {
                    ROOM_NUMBERS.map(i => roomComponents(i))
                }
            </div>
        </div>
    );

}
