import React, { useState } from 'react';
import ErrorHandlingPanel from '../../components/ErrorHandlingPanel';

export const ERROR_NONE = 'none';
export const ERROR_CONN = 'connection_error';
export const ERROR_400 = 'bad_request_error';
export const ERROR_403 = 'forbidden_error';
export const ERROR_404 = 'not_found_error';
export const ERROR_500 = 'internal_server_error';
export const ERROR_DEFAULT = 'default_error';

/**
 * 
 * @param {any} initialValue 
 * @param {{fn: Function, args: [any]}} api 
 * @param {Function} dataProcessor 
 * @param {{divHeight: number, showErrorText: boolean, showSpinner: boolean}} handlerComponentConfig 
 */
const useFetch = (
    initialValue,
    api,
    dataProcessor
) => {

    const { fn, args } = api;
    
    const [data, setData] = useState(initialValue);
    const [isLoading, setLoading] = useState(false);
    const [errorCode, setErrorCode] = useState(ERROR_NONE);
    const showErrorHandlerComponent = isLoading || (errorCode !== ERROR_NONE);

    const fetchData = async () => {
        setLoading(true);
        await fn(...args)
            .then(({ data }) => {
                if (dataProcessor)
                    setData(dataProcessor(data));
                else
                    setData(data);
                setLoading(false);
            })
            .catch((err) => {
                const { response } = err;
                if (!response) {
                    setErrorCode(ERROR_CONN);
                    setLoading(false);
                    return;
                }
                const { status } = response;
                switch (status) {
                    case 400:
                        setErrorCode(ERROR_400);
                        break;
                    case 404:
                        setErrorCode(ERROR_404);
                        break;
                    case 500:
                        setErrorCode(ERROR_500);
                        break;
                    default:
                        setErrorCode(ERROR_DEFAULT);
                }
                setLoading(false);
            });
    }

    const ErrorHandlerComponent = ({
        width,
        height,
        showErrorText,
        showSpinner
    }) => (
        showErrorHandlerComponent && (
            <ErrorHandlingPanel
                isLoading={isLoading}
                errorCode={errorCode}
                width={width}
                height={height}
                showErrorText={showErrorText}
                showSpinner={showSpinner}
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

export default useFetch;