import { useSelector } from 'react-redux';

const process = (obj, language) => (
    obj[language]
    || Object.keys(obj).reduce((prev, key) => ({
        ...prev, 
        [key]: process(obj[key], language)
    }), {})
);

export default (text) => {
    const language = useSelector(state => state.config.language);
    return [process(text, language), language];
};