import React, { useState, useCallback } from 'react';
import { ErrorHandlingPanel } from 'components/common';

export const ERROR_NONE = 'none';
export const ERROR_CONN = 'connection_error';
export const ERROR_400 = 'bad_request_error';
export const ERROR_403 = 'forbidden_error';
export const ERROR_404 = 'not_found_error';
export const ERROR_500 = 'internal_server_error';
export const ERROR_DEFAULT = 'default_error';

export default (initialValue) => {
    
    const [data, setData] = useState(initialValue);
    const [isLoading, setLoading] = useState(false);
    const [errorCode, setErrorCode] = useState(ERROR_NONE);
    const isError = isLoading || (errorCode !== ERROR_NONE);

    const fetchData = useCallback(async (fn, args, postProcessor) => {

        setLoading(true);
        await fn(...args)
            .then(({ data }) => {
                setLoading(false);
                setData(postProcessor ? postProcessor(data) : data);
            })
            .catch((err) => {
                const { response } = err;
                setLoading(false);
                if (!response) {
                    setErrorCode(ERROR_CONN);
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
            });

    }, [setData, setLoading, setErrorCode]);

    const ErrorHandlerComponent = ({
        width,
        height,
        showErrorText,
        showSpinner,
        showBackground
    }) => (
        isError && (
            <ErrorHandlingPanel
                isLoading={isLoading}
                errorCode={errorCode}
                width={width}
                height={height}
                showErrorText={showErrorText}
                showSpinner={showSpinner}
                showBackground={showBackground}
            />
        )
    )

    return [data, fetchData, isLoading, isError, ErrorHandlerComponent];

}