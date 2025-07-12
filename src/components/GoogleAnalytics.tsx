'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Script from 'next/script';

const pageview = (url: string, ga_id: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', ga_id, {
            page_path: url,
        });
    }
};

export default function GoogleAnalytics({ ga_id }: { ga_id: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + searchParams.toString();
        pageview(url, ga_id);
    }, [pathname, searchParams, ga_id]);

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${ga_id}');
                `,
                }}
            />
        </>
    );
};
