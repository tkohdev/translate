import config from './config.js';
// import Translate from './aws-sdk-2.1692.0.js';
// import { Translate } from "@aws-sdk/client-translate"; // ES Modules import

// Genesys Cloud Language Code to AWS Translate Language Code
const languageCodeMapping = {
    'cs': 'cs',
    'da': 'da',
    'de': 'de',
    'en-us': 'en',
    'es': 'es',
    'fr': 'fr',
    'it': 'it',
    'nl': 'nl',
    'no': 'no',
    'pl': 'pl',
    'pt-br': 'pt',
    'fi': 'fi',
    'sv': 'sv',
    'tr': 'tr',
    'th': 'th',
    'ja': 'ja',
    'zh-cn': 'zh',
    'zh-tw': 'zh-TW',
	'ko-kr': 'ko-kr'
};


export default {
    translateText(text, language, callback) {
        let language_code = languageCodeMapping[language] ? 
                    languageCodeMapping[language] : language;

        let data = {
            raw_text: text,
            source_language: 'auto',
            target_language: 'language_code'
        };

        fetch(config.translateServiceURI,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        )
        .then(response => response.json())
        .then(translationData => {
            console.log(JSON.stringify(translationData));
			console.log("translate success!!!");

            callback(translationData);
        })
        .catch(e => console.error(e));
    }
};
