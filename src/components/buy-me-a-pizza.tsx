
"use client";

import React, { useEffect } from 'react';

const SCRIPT_ID = 'buy-me-a-pizza-script';
const BUTTON_ID = 'buy-me-a-pizza-button';

export function BuyMeAPizza() {
  useEffect(() => {
    // Check if the script is already on the page to prevent duplicates
    if (document.getElementById(SCRIPT_ID)) {
      // If the script exists but the button doesn't, it means we might need to re-init
      // The easiest way is to let the script handle it, but sometimes we need to nudge it.
      // For now, we assume if script exists, it's handling things.
      return;
    }
    
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
    script.async = true;
    script.setAttribute('data-name', 'bmc-button');
    script.setAttribute('data-slug', 'emailsig');
    script.setAttribute('data-color', '#FFDD00');
    script.setAttribute('data-emoji', '🍕');
    script.setAttribute('data-font', 'Cookie');
    script.setAttribute('data-text', 'Buy me a pizza?');
    script.setAttribute('data-outline-color', '#000000');
    script.setAttribute('data-font-color', '#000000');
    script.setAttribute('data-coffee-color', '#ffffff');
    
    // Add an onload handler to create the button's anchor tag after the script loads.
    script.onload = () => {
      // The script creates a global `BMAC_BUTTON` object. We can check for it.
      // The script itself should find the data-name="bmc-button" and replace it.
      // We just need to ensure the anchor tag is there.
       if (!document.getElementById(BUTTON_ID)) {
         const anchor = document.createElement('a');
         anchor.id = BUTTON_ID;
         anchor.href = "https://www.buymeacoffee.com/emailsig";
         anchor.className = "bmc-button";
         // The container div will be replaced by the widget
         const container = document.getElementById('buy-me-a-pizza-container');
         if(container) {
            container.appendChild(anchor);
         }
       }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup: remove the script and any created button when the component unmounts
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // The widget might create other elements, which are harder to track.
      // A simple container removal is cleanest.
      const container = document.getElementById('buy-me-a-pizza-container');
      if (container) {
          while (container.firstChild) {
              container.removeChild(container.firstChild);
          }
      }
    };
  }, []);

  // This div is the target for our script.
  return <div id="buy-me-a-pizza-container"></div>;
}
