import React from 'react';
import styles from 'styles/ErrorHandlingPanel.module.scss';
import { MaterialIcon, Spinner } from 'components/common';
import classnames from 'lib/classnames';
import { useLanguages } from 'lib/hooks';
import * as errorCodes from 'lib/hooks/useFetch';
import Text from 'res/texts/ErrorHandlingPanel.text.json';

export default ({ isLoading, errorCode, width, height, showErrorText, showSpinner, showBackground }) => {
    
    const [text] = useLanguages(Text);

    const showError = !isLoading && (errorCode !== errorCodes.ERROR_NONE);
    const showIcon = (errorCode !== errorCodes.ERROR_CONN);

    const useBackground = showBackground && !isLoading && (showErrorText || showSpinner);
    const style = { width, height };

    return (
        <div 
            className={
                classnames([
                    styles.ErrorHandlingPanel,
                    useBackground && styles.ErrorHandlingPanel__use_background
                ])
            }
            style={style}
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