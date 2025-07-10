
"use client";

import React, { useEffect } from 'react';

const SCRIPT_ID = 'buy-me-a-coffee-script';
const CONTAINER_ID = 'buy-me-a-coffee-container';

export function BuyMeAPizza() {
  useEffect(() => {
    // Find the container for the button
    const container = document.getElementById(CONTAINER_ID);
    if (!container) {
      return;
    }

    // Don't add the script if it's already there
    if (document.getElementById(SCRIPT_ID)) {
      // If script exists but button isn't there, maybe it failed to render.
      // Re-running the init function might help.
      if (typeof (window as any).BMCWidget !== 'undefined') {
        (window as any).BMCWidget.init();
      }
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

    // When the script loads, the library should automatically find the element
    // with data-name="bmc-button" inside our container and initialize it.
    script.onload = () => {
       // The library's script might have an init function to call manually
       // if it doesn't automatically detect the new element.
       if (typeof (window as any).BMCWidget !== 'undefined') {
         (window as any).BMCWidget.init();
       }
    };
    
    script.onerror = () => {
        console.error("Buy Me A Coffee script failed to load.");
    };

    // The script should find this anchor tag inside our container
    const anchor = document.createElement('a');
    anchor.href = "https://www.buymeacoffee.com/emailsig";
    anchor.className = "bmc-button"; // The script looks for this class
    
    // Clear the container and add the new anchor
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(anchor);

    // Add the script to the body
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove the script and widget when the component unmounts
      const existingScript = document.getElementById(SCRIPT_ID);
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
      // Also remove any widgets it might have created
      const bmcWidget = document.querySelector('.bmc-widget');
      if (bmcWidget && bmcWidget.parentElement) {
          bmcWidget.parentElement.removeChild(bmcWidget);
      }
       if (container && container.firstChild) {
          container.removeChild(container.firstChild);
       }
    };
  }, []); // The empty dependency array ensures this runs only once on mount.

  // This div is the target container for our script to place the button.
  return <div id={CONTAINER_ID}></div>;
}

    