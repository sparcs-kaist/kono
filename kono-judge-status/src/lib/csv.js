export const convertToCSVString = (data) => {

    const columns = Object.keys(data[0]);

    return [
        columns.join(','),
        ...data.map(singleData => Object.values(singleData).join(','))
    ].join('\n');

}