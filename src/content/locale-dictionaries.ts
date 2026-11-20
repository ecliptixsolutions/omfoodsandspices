import {translations} from './translations';
import {extraTranslations} from './translations-extra';
import {contentTranslations} from './translations-content';
import {otherTranslations} from './translations-other';
import {remainingTranslations} from './translations-remaining';
import {validationTranslations} from './translations-validation';
import {seoTranslations} from './translations-seo';
export const localeDictionaries={
 hi:{...translations.hi,...extraTranslations.hi,...contentTranslations.hi,...otherTranslations.hi,...remainingTranslations.hi,...validationTranslations.hi,...seoTranslations.hi},
 gu:{...translations.gu,...extraTranslations.gu,...contentTranslations.gu,...otherTranslations.gu,...remainingTranslations.gu,...validationTranslations.gu,...seoTranslations.gu},
};
