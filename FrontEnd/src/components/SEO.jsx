import React from 'react';

const setTag = (selector, createTagName, attrs) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(createTagName);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    el.setAttribute(k, v);
  });
  return el;
};

const removeIfExists = (selector) => {
  const el = document.head.querySelector(selector);
  if (el) el.remove();
};

const SEO = ({
  title,
  description,
  canonical,
  image,
  noindex = false,
}) => {
  React.useEffect(() => {
    if (title) document.title = title;
    if (description) setTag('meta[name="description"]', 'meta', { name: 'description', content: description });
    if (canonical) setTag('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical });

    // Robots
    setTag('meta[name="robots"]', 'meta', { name: 'robots', content: noindex ? 'noindex,nofollow' : 'index,follow' });

    // Open Graph
    if (title) setTag('meta[property="og:title"]', 'meta', { property: 'og:title', content: title });
    if (description) setTag('meta[property="og:description"]', 'meta', { property: 'og:description', content: description });
    if (canonical) setTag('meta[property="og:url"]', 'meta', { property: 'og:url', content: canonical });
    if (image) setTag('meta[property="og:image"]', 'meta', { property: 'og:image', content: image });

    // Twitter
    if (title) setTag('meta[name="twitter:title"]', 'meta', { name: 'twitter:title', content: title });
    if (description) setTag('meta[name="twitter:description"]', 'meta', { name: 'twitter:description', content: description });
    if (image) setTag('meta[name="twitter:image"]', 'meta', { name: 'twitter:image', content: image });
  }, [title, description, canonical, image, noindex]);

  return null;
};

export default SEO;


