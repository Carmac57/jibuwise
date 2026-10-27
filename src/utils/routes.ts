/**
 * JibuWise Routing & Path Resolution Utilities
 * Standard path-based routing with fallback and legacy hash migration.
 */

import { getToolBySlug, TOOLS } from '../config/tools';
import { CATEGORIES } from '../config/categories';

export interface RouteResolution {
  view: string;
  param?: string;
  canonicalPath: string;
  isNotFound?: boolean;
}

/**
 * Builds the canonical path for any view and parameter
 */
export function getPathForView(view: string, param?: string): string {
  if (view === 'home' || !view) return '/';
  if (view === 'all-tools' || view === 'tools') return '/tools';
  if (view === 'about') return '/about';
  if (view === 'contact') return '/contact';
  if (view === 'privacy') return '/privacy';
  if (view === 'terms') return '/terms';
  if (view === 'disclaimer') return '/disclaimer';

  if (view === 'category' && param) {
    const cat = CATEGORIES.find((c) => c.id === param);
    return `/category/${cat ? cat.id : param}`;
  }

  if (view === 'tool' && param) {
    const tool = getToolBySlug(param);
    return `/tools/${tool ? tool.slug : param}`;
  }

  if (view === 'not-found') {
    return param ? (param.startsWith('/') ? param : `/${param}`) : '/404';
  }

  return `/${view}`;
}

/**
 * Parses pathname and optional legacy hash into view and parameters.
 */
export function parseRoute(pathname: string, hash?: string): RouteResolution {
  // 1. Check for legacy hash fragments (#/tool/..., #/category/..., #/tools, etc.)
  if (hash && hash.startsWith('#/')) {
    const hashClean = hash.replace(/^#\/?/, '').trim();
    const hashParts = hashClean.split('/');
    const hashRoute = hashParts[0];
    const hashParam = hashParts[1];

    if (!hashClean || hashClean === 'home') {
      return { view: 'home', canonicalPath: '/' };
    }
    if (hashRoute === 'tools' || hashRoute === 'all-tools') {
      return { view: 'all-tools', canonicalPath: '/tools' };
    }
    if (hashRoute === 'tool' || hashRoute === 'calculator') {
      if (hashParam) {
        const tool = getToolBySlug(hashParam);
        if (tool) {
          return { view: 'tool', param: tool.slug, canonicalPath: `/tools/${tool.slug}` };
        }
      }
      return { view: 'not-found', param: hashClean, canonicalPath: `/tools/${hashParam || ''}`, isNotFound: true };
    }
    if (hashRoute === 'category' && hashParam) {
      const cat = CATEGORIES.find((c) => c.id === hashParam);
      if (cat) {
        return { view: 'category', param: cat.id, canonicalPath: `/category/${cat.id}` };
      }
      return { view: 'not-found', param: hashClean, canonicalPath: `/category/${hashParam}`, isNotFound: true };
    }
    if (['about', 'contact', 'privacy', 'terms', 'disclaimer'].includes(hashRoute)) {
      return { view: hashRoute, canonicalPath: `/${hashRoute}` };
    }
  }

  // 2. Parse standard path-based URL
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  if (cleanPath === '/' || cleanPath === '') {
    return { view: 'home', canonicalPath: '/' };
  }

  if (cleanPath === '/tools' || cleanPath === '/all-tools') {
    return { view: 'all-tools', canonicalPath: '/tools' };
  }

  if (cleanPath === '/about') {
    return { view: 'about', canonicalPath: '/about' };
  }

  if (cleanPath === '/contact') {
    return { view: 'contact', canonicalPath: '/contact' };
  }

  if (cleanPath === '/privacy') {
    return { view: 'privacy', canonicalPath: '/privacy' };
  }

  if (cleanPath === '/terms') {
    return { view: 'terms', canonicalPath: '/terms' };
  }

  if (cleanPath === '/disclaimer') {
    return { view: 'disclaimer', canonicalPath: '/disclaimer' };
  }

  // Tool subpaths: /tools/:slug or /tool/:slug or /calculator/:slug
  const toolMatch = cleanPath.match(/^\/(?:tools|tool|calculator)\/([^/]+)$/);
  if (toolMatch) {
    const slug = toolMatch[1];
    const tool = getToolBySlug(slug);
    if (tool) {
      return { view: 'tool', param: tool.slug, canonicalPath: `/tools/${tool.slug}` };
    }
    return { view: 'not-found', param: cleanPath, canonicalPath: cleanPath, isNotFound: true };
  }

  // Category subpaths: /category/:id or /categories/:id
  const categoryMatch = cleanPath.match(/^\/(?:category|categories)\/([^/]+)$/);
  if (categoryMatch) {
    const catId = categoryMatch[1];
    const category = CATEGORIES.find((c) => c.id === catId);
    if (category) {
      return { view: 'category', param: category.id, canonicalPath: `/category/${category.id}` };
    }
    return { view: 'not-found', param: cleanPath, canonicalPath: cleanPath, isNotFound: true };
  }

  // Any other route is 404
  return { view: 'not-found', param: cleanPath, canonicalPath: cleanPath, isNotFound: true };
}
