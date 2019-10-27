import React, { useState, Fragment } from 'react';
import styles from '../styles/RoomStatePanel.module.scss';
import RoomDetailPanel from './RoomDetailPanel';
import SVGPathsEmpty from '../res/icons/room-empty.json';
import SVGPathsFilled from '../res/icons/room-filled.json';
import classnames from '../lib/classnames';

function state2classname(state) {

    if (state === 0)
        return styles.RoomStatePanel__room_empty;
    if (state === 1)
        return styles.RoomStatePanel__room_filled;
    
    return styles.RoomStatePanel__room_null;

}

function highlight2state(highlight) {

    if (highlight === 'none')
        return 'none';
    if (highlight === 'empty')
        return 0;
    if (highlight === 'filled')
        return 1;
    if (highlight === 'null')
        return undefined;

}

function state2path(state) {

    if (state === 0)
        return SVGPathsEmpty;
    if (state === 1)
        return SVGPathsFilled;
    return SVGPathsFilled;

}

const ROOM_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

export default ({ rooms, highlight }) => {

    const [hover, setHover] = useState(null);
    
    const roomComponents = (room_idx) => {

        const room = rooms.find(e => e.room_number === room_idx);
        const { room_number, state } = room || {};
        
        const isHovered = (hover === room_number);

        const onMouseOver = room && (() => setHover(room.room_number));
        const onMousOut = room && (() => setHover(null));

        const showHighlight = (highlight2state(highlight) === state) || ( (state === 1) && isHovered );
        const showAnimation = (state !== 1) && isHovered;

        return (
            <Fragment key={`room-fragment-${room_idx}`}>
                <svg
                    style={{
                        position: 'absolute',
                        width: 600,
                        height:604,
                    }}
                    className={classnames([
                        state2classname(state),
                        showHighlight && styles.RoomStatePanel__room_highlight,
                        showAnimation && styles.RoomStatePanel__room_filled_animation
                    ])} 
                >
                    <path
                    d={state2path(state).path[room_idx]}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMousOut}
                    />
                </svg>
            </Fragment>
        );

    };

    return (
        <div>
            <div className={styles.RoomStatePanel} width="545" height="604" viewBox="0 0 545 604" xmlns="http://www.w3.org/2000/svg">
                {
                    ROOM_NUMBERS.map(i => roomComponents(i))
                }
            </div>
            {
                ROOM_NUMBERS.map(i => {
                    if (hover !== i)
                        return null;
                    return (
                        <RoomDetailPanel 
                            key={`room-detail-${i}`}
                            x={SVGPathsFilled.pos[i].x} 
                            y={SVGPathsFilled.pos[i].y}
                            room={rooms.find(e => e.room_number === i)}
                        />
                    )
                })
            }
        </div>
    );

}