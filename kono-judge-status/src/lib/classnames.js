export default (classnames) => {
    return classnames
        .filter(e => !!e)
        .join(' ');
};