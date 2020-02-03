export const TIME_FILTERS = ['10sec', '1min', '10min', '1h', '6h', '24h'];
export const DATA_KEYS = ['IR0', 'IR1', 'IR2', 'IR3']

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

export function formatData(rawData) {
    const { timestamp, data: dataArray } = rawData;
    return DATA_KEYS.reduce(
        (prev, key, idx) => {
            prev[key] = dataArray[idx];
            return prev;
        }, 
        { timestamp }
    );
}

export function parseData(jsonData) {
    const parsed = JSON.parse(jsonData);
    const { device_id: deviceID, ...rest } = parsed;
    const { timestamp } = rest;
    return { [deviceID]: { [timestamp]: formatData(rest) } };
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
            const unordered = { ...data1[deviceID], ...data2[deviceID] };
            obj[deviceID] = Object.keys(unordered).sort()
                .reduce((prev, key) => { 
                    prev[key] = unordered[key]; 
                    return prev; 
                }, {});
            return obj;
        }, {}
    );
}

export function processAPIData(apiData) {
    return apiData.reduce(
        (obj, { device_id: deviceID, ...rest }) => {
            const { timestamp } = rest;
            if (!obj[deviceID])
                obj[deviceID] = {};
            obj[deviceID][timestamp] = formatData(rest);
            return obj;
        }, {}
    );
}

export function generateFilter({ data, lastUpdated }) {
    return (deviceID, recent) => filterData(data, lastUpdated, deviceID, recent);
}