import React, { useState } from 'react';
import styles from '../styles/NavPanel.module.scss';

export default ({ menus, contents }) => {

    const [selected, setSelected] = useState(0);

    return (
        <div className={styles.NavPanel}>
            <div className={styles.NavPanel__wrapper}>
                {
                    menus.map((menu, idx) => {
                        return (
                            <div
                                key={`nav-item-${menu.key}`}
                                className={[
                                    styles.NavPanel__menu, 
                                    idx === selected && styles.NavPanel__selected
                                ].filter(e => !!e).join(' ')}
                                onClick={() => { setSelected(idx); }}
                            >
                                { menu }
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.NavPanel__content}>
                {
                    (() => contents[selected])()
                }
            </div>
        </div>
    )

}