import db from '..';

/**
 * Creates a model representing a table.
 * @param {string} name
 * @param {{key: string, type: string, nullable: boolean, verifier: function, fk: string}[]} columns
 */
export const createModel = (name, columns) => {

    const _name = name;

    const _columns = columns.map(column => ({
        key: column.key,
        type: column.type,
        nullable: column.nullable !== undefined ? column.nullable : true,
        verifier: column.verifier || (x => true),
        fk: column.fk,
        selectorString: `${_name}.${column.key}`
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
        _model[column.key] = column;
    });

    return {
        where(column, value) {
            const { key, type, nullable, verifier, _detailedType, _detailedTypeVerifier, selectorString } = column;
            if (!_model[key])
                throw new Error(`invalid column name: ${key}`);

            if (value === undefined)
                return { filterString: null };
            
            if (typeof value !== type && (!nullable || value !== null))
                throw new Error(`invalid type for ${key}: should be ${type}`);
            if (_detailedTypeVerifier && !_detailedTypeVerifier(value))
                throw new Error(`invalid type for ${key}: should be ${_detailedType}`)
            if (!verifier(value))
                throw new Error(`invalid value for ${key}: got ${value}`);
                
            return {
                filterString: `${selectorString} = ${(() => {
                    switch (type) {
                        case 'number':
                            return `${value}`;
                        case 'string':
                            return `\"${value}\"`;
                        case 'boolean':
                            return `${value ? 1 : 0}`;
                        case 'object':
                            switch (_detailedType) {
                                case 'Date':
                                    return `${value.getTime()}`
                                default:
                                    throw new Error(`Not supported type: ${type}`);
                            }
                        default:
                            throw new Error(`Not supported type: ${type}`);
                    }
                })()}`
            };
        },
        whereString(wheres) {
            if (wheres === undefined)
                return '';
            return ' WHERE '
                + wheres
                    .filter(where => !!where.filterString)
                    .map(where => where.filterString)
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
        sortString(sort) {
            if (sort === undefined)
                return '';
            if (!sort.by)
                throw new Error(`by is required for sort`);
            if (!sort.by.selectorString)
                throw new Error(`use column() method to define columns`);
            if (sort.order && (sort.order !== 'ASC' && sort.order !== 'DESC'))
                throw new Error(`invalid value for order: got ${sort.order}`);
            return ` ORDER BY ${sort.by.selectorString} ${sort.order || ''} `
        },
        selectString(selects) {
            if (selects === undefined)
                return ` SELECT ${_name}.* `
            return ` SELECT ${
                selects
                    .map(select => {
                        if (!select.selectorString)
                            throw new Error(`use column() method to define columns`);
                        return select.selectorString;
                    })
                    .join(', ')
            } `;
        },
        groupString(group) {
            if (group === undefined)
                return '';
            if (!group.selectorString)
                throw new Error(`use column() method to define columns`);
            return ` GROUP BY ${group.selectorString} `;  
        },
        count(column) {
            return {
                selectorString: `COUNT(${column.selectorString})`
            }
        },
        select(query) {
            const { where, select, limit, sort, group, join } = query || {};
            const fn = this.selectString(select)
                + (join ? (select.length > 0 ? ', ' : '') + join.map(e => e.selectString).join(' ') : '')
                + ` FROM ${_name} `
                + (join ? join.map(e => e.joinString).join(' ') : '')
                + this.whereString(where)
                + this.groupString(group)
                + this.sortString(sort)
                + this.limitString(limit)
                + ';';
            console.log(`${_name}.select: ` + fn);
            return db.query(fn);
        },
        innerJoin({ on, select }) {
            if (!on.fk)
                throw new Error(`column ${on.key} does not have a foriegn key`);
            return {
                joinString: ` INNER JOIN ${_name} ON ${on.selectorString} = ${on.fk} `,
                selectString: select.map(el => el.selectorString).join(', ')
            };
        },
        column(el) {
            if (!_model[el])
                throw new Error(`invalid column name: got ${el}`);
            return _model[el];
        },
        allColumns() {
            return _columns;
        }
    };
};