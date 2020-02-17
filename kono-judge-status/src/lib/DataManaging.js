export const TIME_FILTERS = ['10sec', '1min', '10min', '1h', '6h', '24h'];
export const DATA_KEYS = ['IR0', 'IR1', 'IR2', 'IR3'];
export const LABEL_KEY = 'state';

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
    const deviceIDs = Object.keys(data1);
    for (var deviceID in data2) {
        if (deviceIDs.indexOf(deviceID) === -1)
            deviceIDs.push(deviceID);
    }
    return deviceIDs.reduce(
        (obj, deviceID) => {
            const timestamps1 = data1[deviceID] ? Object.keys(data1[deviceID]) : [];
            const timestamps2 = data2[deviceID] ? Object.keys(data2[deviceID]) : [];
            if (timestamps2.length === 1) {
                if (data1[deviceID]) {
                    obj[deviceID] = data1[deviceID];
                    obj[deviceID][timestamps2[0]] = data2[deviceID][timestamps2[0]];
                }
                else {
                    obj[deviceID] = data2[deviceID];
                }
            }
            else {
                obj[deviceID] = {};
                let idx1 = 0;
                let idx2 = 0;
                while (idx1 < timestamps1.length && idx2 < timestamps2.length) {
                    if (timestamps1[idx1] < timestamps2[idx2]) {
                        obj[deviceID][timestamps1[idx1]] = data1[deviceID][timestamps1[idx1]];
                        idx1++;
                    }
                    else if (timestamps1[idx1] > timestamps2[idx2]) {
                        obj[deviceID][timestamps2[idx2]] = data2[deviceID][timestamps2[idx2]];
                        idx2++;
                    }
                    else {
                        obj[deviceID][timestamps1[idx1]] = data1[deviceID][timestamps1[idx1]];
                        idx1++;
                        idx2++;
                    }
                }
                while (idx1 < timestamps1.length) {
                    obj[deviceID][timestamps1[idx1]] = data1[deviceID][timestamps1[idx1]];
                    idx1++;
                }
                while (idx2 < timestamps2.length) {
                    obj[deviceID][timestamps2[idx2]] = data2[deviceID][timestamps2[idx2]];
                    idx2++;
                }
            }
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

export function addLabel(data, history) {
    if (history.length === 0)
        return data;

    const labeledData = [];
    let lastHistoryIndex = -1;

    for (var idx in data) {
        const { timestamp } = data[idx];
        while (lastHistoryIndex + 1 < history.length
            && history[lastHistoryIndex + 1].timestamp < timestamp) {
            lastHistoryIndex++;
        }
        if (lastHistoryIndex === -1 
            || history[lastHistoryIndex].timestamp === undefined) {
            labeledData.push({
                ...data[idx],
                [LABEL_KEY]: ''
            });
        }
        else {
            labeledData.push({
                ...data[idx],
                [LABEL_KEY]: history[lastHistoryIndex].change ? 1 : 0
            });
        }
    }

    return labeledData;
}

export function sampleFromData(dataArray, sampleFrequency) {
    if (sampleFrequency === 1 || dataArray.length <= 1)
        return dataArray;

    const sampledArray = [], sum = {};
    const keys = Object.keys(dataArray[0]);
    keys.forEach(key => { sum[key] = 0.; });

    for (var i = 0; i < dataArray.length; i++) {
        const currentData = dataArray[i];
        keys.forEach(key => { sum[key] += currentData[key] / sampleFrequency; })
        if ((i + 1) % sampleFrequency === 0) {
            const sampled = {};
            keys.forEach(key => { sampled[key] = sum[key]; sum[key] = 0.; });
            sampledArray.push(sampled);
        }
    }
    
    return sampledArray;
}
