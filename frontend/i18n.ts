import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./src/core/i18n/messages/${locale}.json`)).default,
}));
