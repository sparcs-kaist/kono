import React from 'react';

export default ({ noti }) => {

    const { sid, text, created_time: createdTime } = noti;

    return (
        <div>
            <span>{ sid }</span>
            <span>{ text }</span>
            <span>{ createdTime }</span>
        </div>
    )

}