import React from 'react';
import style from 'styles/ErrorHandlingPanel.module.scss';
import { MaterialIcon, Spinner } from 'components/common';
import classnames from 'lib/classnames';
import { useLanguages } from 'lib/hooks';
import * as errorCodes from 'lib/hooks/useFetch';
import Text from 'res/texts/ErrorHandlingPanel.text.json';

export default ({ isLoading, errorCode, showErrorText, showSpinner, showBackground }) => {
    
    const [text] = useLanguages(Text);

    const showError = !isLoading && (errorCode !== errorCodes.ERROR_NONE);
    const showIcon = (errorCode !== errorCodes.ERROR_CONN);

    const useBackground = showBackground && !isLoading && (showErrorText || showSpinner);

    return (
        <div 
            className={
                classnames([
                    style.ErrorHandlingPanel,
                    useBackground && style.ErrorHandlingPanel__use_background
                ])
            }
        >
            {
                isLoading && (
                    showSpinner && <Spinner />
                )
            }
            {
                showError && (
                    <>
                        <MaterialIcon md48>{ showIcon && 'error_outline' }</MaterialIcon>
                        <div>{ showErrorText && text[errorCode] }</div>
                    </>
                )
            }
        </div>
    )

}