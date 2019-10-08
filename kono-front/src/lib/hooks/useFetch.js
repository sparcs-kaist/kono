import React, { useState } from 'react';
import ErrorHandlingPanel from '../../components/ErrorHandlingPanel';

export const ERROR_NONE = 'none';
export const ERROR_CONN = 'connection_error';
export const ERROR_400 = 'bad_request_error';
export const ERROR_500 = 'internal_server_error';
export const ERROR_DEFAULT = 'default_error';

export default (
    initialValue,
    api,
    args,
    dataProcessor,
    divHeight
) => {

    const [data, setData] = useState(initialValue);
    const [isLoading, setLoading] = useState(false);
    const [errorCode, setErrorCode] = useState(ERROR_NONE);
    const showErrorHandlerComponent = isLoading || (errorCode !== ERROR_NONE);

    const fetchData = async () => {
        setLoading(true);
        await api(...args)
            .then(({ data }) => {
                setLoading(false);
                if (dataProcessor)
                    setData(dataProcessor(data));
                else
                    setData(data);
            })
            .catch((err) => {
                setLoading(false);
                const { response } = err;
                if (!response) {
                    setErrorCode(ERROR_CONN);
                    return;
                }
                const { status } = response;
                switch (status) {
                    case 400:
                        setErrorCode(ERROR_400);
                        break;
                    case 500:
                        setErrorCode(ERROR_500);
                        break;
                    default:
                        setErrorCode(ERROR_DEFAULT);
                }
            });
    }

    const ErrorHandlerComponent = () => (
        showErrorHandlerComponent && (
            <ErrorHandlingPanel
                isLoading={isLoading}
                errorCode={errorCode}
                height={divHeight}
            />
        )
    )

    return [
        data, 
        fetchData, 
        ErrorHandlerComponent,
        showErrorHandlerComponent
    ];

}