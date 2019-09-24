import React from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default () => {

    const login = useSelector(state => state.auth.login, []);

    if (login === 'rejected')
        return (<Redirect to="/login?state=forbidden&prev=write" />);

    return (
        <div>
            kono-front::write_page
        </div>
    );

}