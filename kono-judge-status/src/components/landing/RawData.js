import React, { useContext } from 'react';
import { DataContext } from 'components/provider/DataProvider';

export default () => {

    const { data } = useContext(DataContext);

    return (
        <div>
            { JSON.stringify(data) }
        </div>
    )

}