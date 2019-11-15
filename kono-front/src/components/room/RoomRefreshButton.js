import React from 'react';
import classnames from 'lib/classnames';
import { MaterialIcon, Spinner } from 'components/common';
import { useLanguages } from 'lib/hooks';
import Text from 'res/texts/RoomRefreshButton.text.json';

export default ({ 
    isLoading, 
    onClickRefresh, 
    lastUpdatedTime,
    styles
}) => {

    const showRefresh = !isLoading;
    const showLoading = isLoading;

    const [text, language] = useLanguages(Text);

    const {
        wrapper: styleWrapper,
        interactable: styleInteractable,
        icon: styleIcon,
        text: styleText
    } = styles || {};

    return (
        <>
            {
                showRefresh && (
                    <div 
                        className={classnames([styleWrapper, styleInteractable])}
                        onClick={onClickRefresh}
                    >
                        <div className={styleIcon}>
                            <MaterialIcon md24>refresh</MaterialIcon>
                        </div>
                        <div className={styleText}>
                            { text.refresh }: { new Date(lastUpdatedTime).toLocaleTimeString(language) }
                        </div>
                    </div>
                )
            }
            {
                showLoading && (
                    <div className={styleWrapper}>
                        <div className={styleIcon}>
                            <Spinner small primary />
                        </div>
                        <div className={styleText}>
                            { text.loading }
                        </div>
                    </div>
                )
            }
        </>
    )

}