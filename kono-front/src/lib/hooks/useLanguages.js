import { useSelector } from 'react-redux';

const process = (obj, language) => (
    obj[language] 
    || Object.keys(obj).reduce((prev, key) => ({
        ...prev, 
        [key]: process(obj[key], language)
    }), {})
);

export default (text) => process(text, useSelector(state => state.config.language, []));