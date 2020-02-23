import { useSelector } from 'react-redux';

const process = (obj, language) => (
    (obj[language] === undefined || obj[language] === null)
    ? Object.keys(obj).reduce((prev, key) => ({
        ...prev, 
        [key]: process(obj[key], language)
    }), {})
    : obj[language]
);

export default (text) => {
    const language = useSelector(state => state.config.language);
    return [process(text, language), language];
};