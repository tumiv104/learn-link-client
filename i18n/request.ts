import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

export default getRequestConfig(async() => {
    const cookiesLocale = (await cookies()).get("MYNEXTAPP_LOCALE")?.value;
    const locale = cookiesLocale || "en";
    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    }
})