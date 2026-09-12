import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Can be imported from a shared config
const locales = ['en', 'es', 'fr', 'de', 'pt'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en'; // fallback
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
