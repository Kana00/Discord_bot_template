// import object of language
import en from './En';
import { isString } from 'util';
import i18next from 'i18next';


i18next.init({
  lng: 'en',
  resources: { en }
});


function translateNumber(oneNumber: number) {
  return oneNumber.toLocaleString();
}

// we only need one method from I18n to translate string
export default function (key: string | number) {
  if (isString(key)) {
    return i18next.t(key);
  } else if (isFinite(key)) {
    return translateNumber(<number>key);
  }
}
