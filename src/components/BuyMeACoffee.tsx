'use client';

import React from 'react';
import Script from 'next/script';
import Link from 'next/link';

export function BuyMeACoffee() {
  return (
    <>
      <div className="flex justify-center mb-4">
        <Link href="https://www.buymeacoffee.com/emailsig" legacyBehavior>
          <a target="_blank" rel="noopener noreferrer"></a>
        </Link>
      </div>

      <Script
        id="buy-me-a-coffee-script"
        strategy="lazyOnload"
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        onLoad={() => {
          const widget = (window as any).BMCWidget;
          if (widget) {
            widget.init({
              slug: 'emailsig',
              color: '#40DCA5',
              emoji: '☕',
              font: 'Cookie',
              text: 'Buy me a coffee',
              'outline-color': '#000000',
              'font-color': '#ffffff',
              'coffee-color': '#FFDD00',
            });
          }
        }}
      />
    </>
  );
}
