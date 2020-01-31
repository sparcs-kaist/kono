import React from 'react';
import { Selector } from 'components/common';
import { TIME_FILTERS } from 'components/provider/DataProvider';

export default ({ selectedFilter, setSelectedFilter }) => {

    return (
        <div>
            <div>
                <span>Time Filter</span>
                <Selector
                    elements={TIME_FILTERS}
                    selected={selectedFilter}
                    setSelected={setSelectedFilter}
                />
            </div>
        </div>
    )

}