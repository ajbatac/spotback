'use client';

import React from 'react';
import Script from 'next/script';
import Link from 'next/link';

export function BuyMeACoffee() {
  return (
    <>
      <Script
        type="text/javascript"
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
      {/* 
        The script from buymeacoffee.com looks for an anchor tag with a specific href 
        to replace with their button. We provide it here. It will be hidden 
        and replaced by the script once it loads.
      */}
      <div className="flex justify-center mb-4">
        <Link href="https://www.buymeacoffee.com/emailsig" legacyBehavior>
          <a target="_blank" rel="noopener noreferrer"></a>
        </Link>
      </div>
    </>
  );
}
