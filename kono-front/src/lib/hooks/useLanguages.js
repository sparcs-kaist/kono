import { useSelector } from 'react-redux';

export default (rawText) => {

    const language = useSelector(state => state.config.language, []);

    const transcriptedText = {};

    Object.keys(rawText).forEach(
        (key) => {
            transcriptedText[key] = rawText[key][language];
        }
    );

    return transcriptedText;

};