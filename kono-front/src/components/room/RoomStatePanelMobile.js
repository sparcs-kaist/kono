import React from 'react';
import styles from 'styles/RoomStatePanelMobile.module.scss';
import Text from 'res/texts/RoomStatePanel.text.json';
import classnames from 'lib/classnames';
import { useLanguages } from 'lib/hooks';

export default ({ rooms }) => {

    return (
        <div className={styles.RoomStatePanelMobile}>
            <div className={styles.grid}>
                <div className={classnames([
                    styles.item,
                    styles.item_1
                ])}>1</div>
                <div className={classnames([
                    styles.item,
                    styles.item_2
                ])}>2</div>
                <div className={classnames([
                    styles.item,
                    styles.item_3
                ])}>3</div>
                <div className={classnames([
                    styles.item,
                    styles.item_4
                ])}>4</div>
                <div className={classnames([
                    styles.item,
                    styles.item_5
                ])}>5</div>
                <div className={classnames([
                    styles.item,
                    styles.item_6
                ])}>6</div>
                <div className={classnames([
                    styles.item,
                    styles.item_7
                ])}>7</div>
            </div>
        </div>
    )

}