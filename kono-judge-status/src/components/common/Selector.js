import React from 'react';
import styles from 'styles/components/Selector.module.scss';
import classnames from 'lib/classnames';

export default ({ elements, selected, setSelected }) => {
    
    return (
        <div className={styles.Selector}>
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
                            { e }
                        </div>
                    )
                })
            }
        </div>
    )

};