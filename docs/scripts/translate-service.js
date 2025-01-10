import config from './config.js';

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
    'zh-tw': 'zh-TW'
};

const { Translate } = require('@aws-sdk/client-translate');

// Configure the AWS Translate client
const translateService = new Translate({ 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const app = express();

export default {
    translateText(text, language, callback) {
        let language_code = languageCodeMapping[language] ? 
                    languageCodeMapping[language] : language;

        let data = {
            raw_text: text,
            source_language: 'auto',
            target_language: language_code
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

            callback(translationData);
        })
        .catch(e => console.error(e));
    }
};

app.post('/translate', (req, res) => {
    const body = req.body;
    const params = {
        Text: body.raw_text,
        SourceLanguageCode: body.source_language,
        TargetLanguageCode: body.target_language
    };

    // Use the translate service
    translateService.translateText(params)
    .then((data) =>{
        let statusCode = data['$metadata'].httpStatusCode;
        let translatedText = data.TranslatedText;

        res.status(statusCode).json({ 
            source_language: data.SourceLanguageCode,
            translated_text: translatedText
        });
    })
    .catch(err => {
        console.error(err);
        res.status(400);
    });
});


