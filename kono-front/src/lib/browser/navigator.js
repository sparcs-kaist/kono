export const userLanguage = (() => {
    if (typeof navigator !== 'undefined') {
        if (navigator.languages) {
            for (let i = 0; i < navigator.languages; i++) {
                if (navigator.languages[i].toLowerCase().includes('kr'))
                    return 'kr';
                if (navigator.languages[i].toLowerCase().includes('en'))
                    return 'en';
            }
        }
        if (navigator.userLanguage) {
            if (navigator.userLanguage.toLowerCase().includes('kr'))
                return 'kr';
            if (navigator.userLanguage.toLowerCase().includes('en'))
                return 'en';
        }
        if (navigator.language) {
            if (navigator.language.toLowerCase().includes('kr'))
                return 'kr';
            if (navigator.language.toLowerCase().includes('en'))
                return 'en';
        }
    }
    return null;
})();