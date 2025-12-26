import en from './en';

const languages = {
  en
};

const currentLang = 'en';

export const t = (key) => {
  const keys = key.split('.');
  let value = languages[currentLang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }
  
  return value;
};

export const setLanguage = (lang) => {
  if (languages[lang]) {
    return lang;
  }
  console.warn(`Language not found: ${lang}`);
  return currentLang;
};

export default {
  t,
  setLanguage
};

