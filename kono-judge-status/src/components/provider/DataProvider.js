import React, { createContext, useState, useContext, useEffect } from 'react';
import * as API from 'api';
import { useFetch } from 'lib/hooks'
import { WebsocketContext } from 'components/provider/WebsocketProvider';

export const DataContext = createContext();

export default ({ children }) => {

    const { state, data } = useContext(WebsocketContext);

    const initialContext = {
        state,
        data
    };

    const [context, setContext] = useState(initialContext);

    useEffect(() => {
        setContext(prevState => ({
            ...prevState,
            data
        }));
    }, [data])

    return (
        <DataContext.Provider value={context}>
            { children }
        </DataContext.Provider>
    )

}