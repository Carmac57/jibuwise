/**
 * JibuWise Static Pre-Rendering Engine (SSG)
 * Generates distinct static HTML documents for every route during build.
 * Ensures initial HTML is rich, semantic, crawlable, and includes route-specific SEO metadata.
 */

import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App, { AppProps } from '../src/App.js';
import { TOOLS, TOOL_SLUG_ALIASES } from '../src/config/tools.js';
import { CATEGORIES } from '../src/config/categories.js';

interface RouteToRender {
  path: string;
  canonicalPath: string;
  title: string;
  description: string;
  keywords?: string[];
  schemaType?: string;
  toolSlug?: string;
  isAlias?: boolean;
}

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('[Prerender] Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Build the comprehensive list of routes to pre-render
const routes: RouteToRender[] = [
  // 1. Homepage
  {
    path: '/',
    canonicalPath: '/',
    title: 'JibuWise — Simple Tools. Clear Answers.',
    description: 'Fast, free online calculators and practical everyday tools for Kenya and beyond. Accurate PAYE tax, M-Pesa fees, loans, land stamp duty, fuel costs, and VAT.',
  },

  // 2. All Tools Directory
  {
    path: '/tools',
    canonicalPath: '/tools',
    title: 'All Online Calculators & Practical Tools — JibuWise',
    description: 'Browse all free computational tools and calculators for Kenya. Calculate PAYE salary tax, M-Pesa tariffs, loans, stamp duty, travel fuel, and VAT.',
  },

  // 3. Calculator Tools
  ...TOOLS.map((tool) => ({
    path: `/tools/${tool.slug}`,
    canonicalPath: `/tools/${tool.slug}`,
    title: `${tool.title} — JibuWise`,
    description: tool.seoDescription || tool.description,
    keywords: tool.keywords,
    toolSlug: tool.slug,
  })),

  // 4. Categories
  ...CATEGORIES.map((cat) => ({
    path: `/category/${cat.id}`,
    canonicalPath: `/category/${cat.id}`,
    title: `${cat.name} Calculators & Tools — JibuWise`,
    description: `${cat.description} Instant, verified computational tools tailored for Kenyan users.`,
  })),

  // 5. Supporting & Trust Pages
  {
    path: '/about',
    canonicalPath: '/about',
    title: 'About JibuWise — Independent Computational Tools',
    description: 'Learn about JibuWise, our editorial standards, statutory formulas, and commitment to privacy and ad-light utility.',
  },
  {
    path: '/contact',
    canonicalPath: '/contact',
    title: 'Contact Us & Feedback — JibuWise',
    description: 'Send feedback, report formula errors, or suggest a new calculator for Kenya and East Africa.',
  },
  {
    path: '/privacy',
    canonicalPath: '/privacy',
    title: 'Privacy Policy — JibuWise',
    description: 'JibuWise calculations run entirely in your browser. We never store, sell, or transmit your financial or personal numbers.',
  },
  {
    path: '/terms',
    canonicalPath: '/terms',
    title: 'Terms of Use — JibuWise',
    description: 'Terms and conditions governing the use of JibuWise calculators and informational resources.',
  },
  {
    path: '/disclaimer',
    canonicalPath: '/disclaimer',
    title: 'Statutory & Calculation Disclaimer — JibuWise',
    description: 'Legal disclaimer regarding computational accuracy, official KRA / EPRA benchmarks, and independent verification.',
  },
  {
    path: '/404',
    canonicalPath: '/',
    title: 'Page Not Found — JibuWise',
    description: 'The requested page or calculator could not be found. Explore our directory of free Kenyan calculators.',
  },
];

// Add alias routes that redirect to canonical versions
for (const [alias, canonical] of Object.entries(TOOL_SLUG_ALIASES)) {
  const tool = TOOLS.find((t) => t.slug === canonical);
  if (tool) {
    routes.push({
      path: `/tools/${alias}`,
      canonicalPath: `/tools/${canonical}`,
      title: `${tool.title} — JibuWise`,
      description: tool.seoDescription || tool.description,
      toolSlug: canonical,
      isAlias: true,
    });
  }
}

function generateStructuredData(route: RouteToRender): object {
  const baseOrg = {
    '@type': 'Organization',
    '@id': 'https://jibuwise.com/#organization',
    name: 'JibuWise',
    url: 'https://jibuwise.com/',
    logo: 'https://jibuwise.com/favicon.ico',
    description: 'Provider of fast, free online calculators and practical everyday computational tools for Kenya and beyond.',
  };

  if (route.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        baseOrg,
        {
          '@type': 'WebSite',
          '@id': 'https://jibuwise.com/#website',
          url: 'https://jibuwise.com/',
          name: 'JibuWise',
          description: 'Simple tools. Clear answers. Free financial, salary, business, and travel calculators.',
          publisher: { '@id': 'https://jibuwise.com/#organization' },
          inLanguage: 'en',
        },
        {
          '@type': 'WebApplication',
          '@id': 'https://jibuwise.com/#application',
          name: 'JibuWise Calculators Suite',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          url: 'https://jibuwise.com/',
          description: route.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KES',
          },
        },
      ],
    };
  }

  if (route.toolSlug) {
    const tool = TOOLS.find((t) => t.slug === route.toolSlug)!;
    return {
      '@context': 'https://schema.org',
      '@graph': [
        baseOrg,
        {
          '@type': 'WebApplication',
          '@id': `https://jibuwise.com/tools/${tool.slug}#application`,
          name: tool.title,
          url: `https://jibuwise.com/tools/${tool.slug}`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          description: tool.seoDescription || tool.description,
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'KES',
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://jibuwise.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Calculators',
              item: 'https://jibuwise.com/tools',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: tool.title,
              item: `https://jibuwise.com/tools/${tool.slug}`,
            },
          ],
        },
      ],
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      baseOrg,
      {
        '@type': 'WebPage',
        '@id': `https://jibuwise.com${route.canonicalPath}#webpage`,
        url: `https://jibuwise.com${route.canonicalPath}`,
        name: route.title,
        description: route.description,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://jibuwise.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: route.title.replace(' — JibuWise', ''),
            item: `https://jibuwise.com${route.canonicalPath}`,
          },
        ],
      },
    ],
  };
}

console.log(`[Prerender] Pre-rendering ${routes.length} distinct HTML routes...`);

let renderedCount = 0;

for (const route of routes) {
  const canonicalUrl = `https://jibuwise.com${route.canonicalPath === '/' ? '' : route.canonicalPath}`;
  const currentUrl = `https://jibuwise.com${route.path === '/' ? '' : route.path}`;

  // 1. Render App tree to HTML string
  const renderedContent = renderToString(React.createElement<AppProps>(App, { initialPath: route.path }));

  // 2. Generate structured data
  const structuredData = JSON.stringify(generateStructuredData(route), null, 2);

  // 3. Replace metadata in template
  let pageHtml = templateHtml;

  // Title
  pageHtml = pageHtml.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);

  // Meta Description
  pageHtml = pageHtml.replace(
    /<meta name="description" content=".*?"\s*\/?>/i,
    `<meta name="description" content="${escapeAttr(route.description)}" />`
  );

  // Canonical URL
  pageHtml = pageHtml.replace(
    /<link rel="canonical" href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // Open Graph
  pageHtml = pageHtml.replace(
    /<meta property="og:url" content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${currentUrl}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:title" content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${escapeAttr(route.title)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta property="og:description" content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${escapeAttr(route.description)}" />`
  );

  // Twitter
  pageHtml = pageHtml.replace(
    /<meta name="twitter:title" content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`
  );
  pageHtml = pageHtml.replace(
    /<meta name="twitter:description" content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`
  );

  // Structured Data Script
  pageHtml = pageHtml.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${structuredData}\n    </script>`
  );

  // If alias, add client-side redirect meta tag
  if (route.isAlias) {
    pageHtml = pageHtml.replace(
      '</head>',
      `    <meta http-equiv="refresh" content="0; url=${route.canonicalPath}" />\n  </head>`
    );
  }

  // 4. Inject rendered app into #root
  pageHtml = pageHtml.replace(
    /<div id="root">[\s\S]*?<\/div>/i,
    `<div id="root">${renderedContent}</div>`
  );

  // 5. Determine target file path
  let targetFilePath: string;
  if (route.path === '/') {
    targetFilePath = path.join(DIST_DIR, 'index.html');
  } else if (route.path === '/404') {
    targetFilePath = path.join(DIST_DIR, '404.html');
  } else {
    const routeFolder = path.join(DIST_DIR, route.path.replace(/^\//, ''));
    fs.mkdirSync(routeFolder, { recursive: true });
    targetFilePath = path.join(routeFolder, 'index.html');
  }

  fs.writeFileSync(targetFilePath, pageHtml, 'utf-8');

  // Also write route.html for hosts that resolve clean URLs directly as .html files
  if (route.path !== '/' && route.path !== '/404') {
    const directHtmlPath = path.join(DIST_DIR, `${route.path.replace(/^\//, '')}.html`);
    fs.mkdirSync(path.dirname(directHtmlPath), { recursive: true });
    fs.writeFileSync(directHtmlPath, pageHtml, 'utf-8');
  }

  renderedCount++;
}

console.log(`[Prerender] Successfully generated ${renderedCount} static HTML files in dist/`);

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, '&quot;');
}
