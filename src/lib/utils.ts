import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function jsonToXml(json: object): string {
    let xml = '';
    const convert = (obj: any, indent: string) => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                // Basic sanitization for XML tag names
                const tag = key.replace(/[^a-zA-Z0-9_.-]/g, '_');

                if (value === null || value === undefined) {
                    xml += `${indent}<${tag}/>\n`;
                } else if (typeof value === 'object') {
                    if (Array.isArray(value)) {
                        value.forEach(item => {
                            const singularTag = tag.endsWith('s') ? tag.slice(0, -1) : 'item';
                            xml += `${indent}<${singularTag}>\n`;
                            convert(item, indent + '  ');
                            xml += `${indent}</${singularTag}>\n`;
                        });
                    } else {
                        xml += `${indent}<${tag}>\n`;
                        convert(value, indent + '  ');
                        xml += `${indent}</${tag}>\n`;
                    }
                } else {
                    const escapedValue = String(value)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&apos;');
                    xml += `${indent}<${tag}>${escapedValue}</${tag}>\n`;
                }
            }
        }
    };
    convert(json, '  ');
    return `<root>\n${xml}</root>`;
}
