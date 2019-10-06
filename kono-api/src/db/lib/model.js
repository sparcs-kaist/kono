import db from '..';

/**
 * Creates a model representing a table.
 * @param {string} name
 * @param {{key: string, type: string, nullable: boolean, verifier: function}[]} columns
 */
export const createModel = (name, columns) => {

    const _name = name;

    const _columns = columns.map(column => ({
        key: column.key,
        type: column.type,
        nullable: column.nullable !== undefined ? column.nullable : true,
        verifier: column.verifier || (x => true)
    }));

    _columns.forEach(column => {
        switch (column.type) {
            case 'Date':
                column.type = 'object';
                column._detailedType = 'Date';
                column._detailedTypeVerifier = x => (x instanceof Date) && !isNaN(x.valueOf());
                break;
            case 'integer':
                column.type = 'number';
                column._detailedType = 'integer';
                column._detailedTypeVerifier = x => Number.isSafeInteger(x);
                break;
            default:
                break;
        }
    });

    const _model = {};
    _columns.forEach(column => {
        const { key, ...props } = column;
        _model[key] = props;
    });

    return {
        verifyFilter(filter) {
            if (filter === undefined)
                return;
            Object.keys(filter).forEach(el => {

                if (!_model[el])
                    throw new Error(`invalid column name: ${el}`);

                if (filter[el] === undefined)
                    return;

                const { type, nullable, verifier, _detailedType, _detailedTypeVerifier } = _model[el];
                
                if (typeof filter[el] !== type && (!nullable || filter[el] !== null))
                    throw new Error(`invalid type for ${el}: should be ${type}`);
                if (_detailedTypeVerifier && !_detailedTypeVerifier(filter[el]))
                    throw new Error(`invalid type for ${el}: should be ${_detailedType}`)
                if (!verifier(filter[el]))
                    throw new Error(`invalid value for ${el}: got ${filter[el]}`);

            });
        },
        filterString(filter) {
            this.verifyFilter(filter);
            if (filter === undefined)
                return '';
            return ' WHERE ' + Object.keys(filter)
                .filter(el => filter[el] !== undefined)
                .map(el => {
                    if (filter[el] === null)
                        return `${el} IS NULL`;
                    switch (_model[el].type) {
                        case 'number':
                            return `${el} = ${filter[el]}`;
                        case 'string':
                            return `${el} = \"${filter[el]}\"`;
                        case 'boolean':
                            return `${el} = ${filter[el] ? 1 : 0}`;
                        case 'object':
                            switch (_model[el]._detailedType) {
                                case 'Date':
                                    return `${el} = ${filter[el].getTime()}`
                                default:
                                    return '';
                            }
                        default:
                            return '';
                    }
                })
                .join(' AND ');
        },
        verifyLimit(limit) {
            if (limit === undefined)
                return;
            const { min, length } = limit;
            if (min) {
                if (typeof min !== 'number')
                    throw new Error(`invalid type for min: should be number`);
                if (min < 0 || !Number.isSafeInteger(min))
                    throw new Error(`invalid value for min: got ${min}`);
            }
            if (length) {
                if (typeof length != 'number')
                    throw new Error(`invalid type for length: should be number`);
                if (length < 1 || length > 64 || !Number.isSafeInteger(length))
                    throw new Error(`invalid value for length: got ${length}`);
            }
            else
                throw new Error(`length is required for limit`);
        },
        limitString(limit) {
            this.verifyLimit(limit);
            if (limit === undefined)
                return ` LIMIT 64 `;
            return ` LIMIT ${limit.min || 0}, ${limit.length} `;
        },
        verifySort(sort) {
            if (sort === undefined)
                return;
            if (!sort.by)
                throw new Error(`by is required for sort`);
            if (!_model[sort.by])
                throw new Error(`invalid column for sort: got ${sort.by}`);
            if (sort.order && (sort.order !== 'ASC' && sort.order !== 'DESC'))
                throw new Error(`invalid value for order: got ${sort.order}`);
        },
        sortString(sort) {
            this.verifySort(sort);
            if (sort === undefined)
                return '';
            return ` ORDER BY ${sort.by} ${sort.order || ''} `
        },
        verifySelect(select) {
            if (select === undefined)
                return;
            select.forEach(el => {
                if (_model[el])
                    return;
                if (el.match(/COUNT\((.+)\)$/))
                    return;

                throw new Error(`invalid value for select: got ${el}`);
            });
        },
        selectString(select) {
            this.verifySelect(select);
            if (select === undefined)
                return ` SELECT * `
            return ` SELECT ${select.join(', ')} `;
        },
        verifyGroup(group) {
            if (group === undefined)
                return;
            if (typeof group !== 'string')
                throw new Error(`invalid type for group: should be string`);
            if (!_model[group])
                throw new Error(`invalid value for group: got ${group}`);
        },
        groupString(group) {
            this.verifyGroup(group);
            if (group === undefined)
                return '';
            return ` GROUP BY ${group} `;  
        },
        count(column) {
            if (!_model[column])
                throw new Error(`invalid value for column: got ${column}`);
            return `COUNT(${column})`;
        },
        select(query) {
            const { filter, select, limit, sort, group } = query || {};
            const fn = this.selectString(select)
                + ` FROM ${_name} `
                + this.filterString(filter)
                + this.groupString(group)
                + this.sortString(sort)
                + this.limitString(limit)
                + ';';
            console.log(`${_name}.select: ` + fn);
            return db.query(fn);
        }
    };
};