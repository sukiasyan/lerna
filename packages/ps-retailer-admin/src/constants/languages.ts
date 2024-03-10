import codes from 'iso-language-codes';

export type LangEnum = {
  [key: string]: string;
};

export const LanguagesTypes: LangEnum = {};

codes.forEach((code) => {
  LanguagesTypes[code.iso639_1] = code.name;
});
