'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export default function LanguageSwitcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    const cookieLocale = document.cookie
        .split(";")
        .find((row) => row.startsWith("MYNEXTAPP_LOCALE"))
        ?.split("=")[1];
        if (cookieLocale) {
            setLocale(cookieLocale);
        } else {
            const browserLocale = navigator.language.slice(0, 2);
            setLocale(browserLocale);
            document.cookie = `MYNEXTAPP_LOCALE=${browserLocale}; path=/; max-age=31536000; SameSite=Lax`;
            router.refresh();
        }
        
  }, [router]);

  const switchLang = (lang: string) => {
    document.cookie = `MYNEXTAPP_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    setLocale(lang);
    router.refresh(); 
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Select value={locale} onValueChange={switchLang}>
        <SelectTrigger className="w-[140px] text-sm text-muted-foreground">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">🇺🇸 English</SelectItem>
          <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
