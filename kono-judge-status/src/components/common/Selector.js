import React from 'react';
import styles from 'styles/components/Selector.module.scss';
import classnames from 'lib/classnames';
import { MaterialIcon } from 'components/common';

export default ({ elements, selected, setSelected, theme }) => {
    
    if (!Array.isArray(elements))
        return null;

    return (
        <div className={classnames([
            styles.Selector,
            styles[theme]
        ])}>
            {
                elements.map(e => {
                    const isSelected = selected === e;
                    const onClick = () => setSelected(e);
                    return (
                        <div
                            className={classnames([
                                styles.item,
                                isSelected && styles.item_selected
                            ])}
                            onClick={onClick}
                            key={`selector-${e}`}>
                            <span>{ e }</span>
                            {
                                isSelected && <MaterialIcon>check_circle</MaterialIcon>
                            }
                        </div>
                    )
                })
            }
        </div>
    )

};