/** JSON embedded in HTML must neutralise </script> sequences from dynamic content. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
