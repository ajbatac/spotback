
"use client";

import React, { useEffect } from 'react';

export function BuyMeAPizza() {
  useEffect(() => {
    const script = document.createElement('script');
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
    
    const container = document.getElementById('buy-me-a-pizza-container');
    if (container) {
      // Clear previous buttons if any to prevent script conflicts on re-render
      while(container.firstChild) {
          container.removeChild(container.firstChild);
      }
      container.appendChild(script);
    }

    return () => {
      // Cleanup the script when the component is unmounted
      if (container && container.contains(script)) {
        try {
            container.removeChild(script);
        } catch (e) {
            // Ignore error if script is already gone
        }
      }
    };
  }, []);

  return <div id="buy-me-a-pizza-container"></div>;
}
