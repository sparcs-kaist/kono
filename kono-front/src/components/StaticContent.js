import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default ({ url }) => {

    const [innerHTML, setInnerHTML] = useState('');

    useEffect(() => {
        axios.get(url)
            .then(res => setInnerHTML(res.data))
            .catch(err => console.log(err));
    }, [url]);

    return (
        <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
    );

}