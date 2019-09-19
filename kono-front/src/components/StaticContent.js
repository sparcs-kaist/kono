import React, { useState, useEffect } from 'react';

export default ({ url }) => {

    const [innerHTML, setInnerHTML] = useState('');

    useEffect(() => {
        fetch(url)
            .then(res => res.text())
            .then(content => { setInnerHTML(content); })
            .catch(err => console.log(err));
    }, [url]);

    return (
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    );

}