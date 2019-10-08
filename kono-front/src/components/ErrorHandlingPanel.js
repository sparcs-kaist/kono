import React from 'react';
import style from '../styles/ErrorHandlingPanel.module.scss';
import MaterialIcon from './MaterialIcon';
import classnames from '../lib/classnames';
import useLanguages from '../lib/hooks/useLanguages';
import Text from '../res/texts/ErrorHandlingPanel.text.json';

export const ERROR_NONE = 'none';
export const ERROR_CONN = 'connection_error';
export const ERROR_400 = 'bad_request_error';
export const ERROR_500 = 'internal_server_error';
export const ERROR_DEFAULT = 'default_error';

export default ({ isLoading, errorCode, height }) => {
    
    const text = useLanguages(Text);

    const showError = !isLoading && (errorCode !== ERROR_NONE);
    const showIcon = (errorCode !== ERROR_CONN);

    return (
        <div 
            className={
                classnames([
                    style.ErrorHandlingPanel,
                    !isLoading && style.ErrorHandlingPanel__use_background
                ])
            }
            style={{ height }}
        >
            {
                isLoading && (
                    <div>
                        Spinner
                    </div>
                )
            }
            {
                showError && (
                    <>
                        <MaterialIcon md48>{ showIcon && 'error_outline' }</MaterialIcon>
                        <div>
                            { text[errorCode] }
                        </div>
                    </>
                )
            }
        </div>
    )

}