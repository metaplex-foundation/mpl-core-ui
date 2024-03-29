import { AppRouterInstance, NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function pushRetainQuery(router: AppRouterInstance, pathname: string, options?: NavigateOptions) {
  const params = new URLSearchParams(window.location.search);

  router.push(`${pathname}?${params.toString()}`, options);
}
