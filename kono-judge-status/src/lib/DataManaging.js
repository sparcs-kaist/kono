export const TIME_FILTERS = ['10sec', '1min', '10min', '1h', '6h', '24h'];

export function recent2millis(recent) {
    switch (recent) {
        case '10sec':
            return 10 * 1000;
        case '1min':
            return 60 * 1000;
        case '10min':
            return 10 * 60 * 1000;
        case '1h':
            return 60 * 60 * 1000;
        case '6h':
            return 6 * 60 * 60 * 1000;
        case '24h':
            return 24 * 60 * 60 * 1000;
        default:
            throw Error(`recent2millis: unsupported recent value ${recent}`);
    }
}

export function filterData(data, lastUpdated, deviceID, recent) {
    if (!data[deviceID])
        return {};
    return Object.keys(data[deviceID])
        .filter(timestampStr => {
            const timestamp = Number(timestampStr);
            return timestamp + recent2millis(recent) >= lastUpdated;
        })
        .reduce((obj, timestamp) => {
            obj[timestamp] = data[deviceID][timestamp];
            return obj;
        }, {});
}

export function mergeData(data1, data2) {
    const deviceIDs = [...Object.keys(data1), ...Object.keys(data2)];
    return deviceIDs.reduce(
        (obj, deviceID) => {
            obj[deviceID] = { ...data1[deviceID], ...data2[deviceID] };
            return obj;
        }, {}
    );
}

export function processAPIData(apiData) {
    return apiData.reduce(
        (obj, { timestamp, device_id: deviceID, ...rest }) => {
            if (!obj[deviceID])
                obj[deviceID] = {};
            obj[deviceID][timestamp] = rest;
            return obj;
        }, {}
    );
}

export function generateFilter({ data, lastUpdated }) {
    return (deviceID, recent) => filterData(data, lastUpdated, deviceID, recent);
}