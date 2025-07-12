'use client';

import React from 'react';
import Script from 'next/script';
import Link from 'next/link';

export function BuyMeACoffee() {
  return (
    <>
      <div className="flex justify-center mb-4">
        {/* 
          This is the target element the script looks for.
          The `legacyBehavior` prop ensures Next.js renders a plain `<a>` tag.
        */}
        <Link href="https://www.buymeacoffee.com/emailsig" legacyBehavior>
          <a target="_blank" rel="noopener noreferrer"></a>
        </Link>
      </div>

      {/* 
        The next/script component loads the external script.
        All the `data-*` attributes configure the button's appearance and text.
        The script will automatically find the anchor tag above and replace it.
      */}
      <Script
        id="buy-me-a-coffee-widget-script"
        strategy="lazyOnload"
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        data-name="bmc-button"
        data-slug="emailsig"
        data-color="#40DCA5"
        data-emoji="☕"
        data-font="Cookie"
        data-text="Buy me a coffee"
        data-outline-color="#000000"
        data-font-color="#ffffff"
        data-coffee-color="#FFDD00"
      />
    </>
  );
}
