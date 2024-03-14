// components/RetainQueryLink.tsx
import Link, { LinkProps } from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

const RetainQueryLink = ({ href, ...props }: LinkProps & PropsWithChildren & React.HTMLAttributes<HTMLBaseElement>) => {
  // 1. use useRouter hook to get access to the current query params
  const router = useRouter();
  const searchParams = useSearchParams();

  // 2. get the pathname
  const pathname = typeof href === 'object' ? href.pathname : href;

  // 3. get the query from props
  // const query =
  //   typeof href === 'object' && typeof href.query === 'object'
  //     ? href.query
  //     : {};

  return (
    <Link
      {...props}
      href={{
        pathname,
        // TODO allow override of query via prop
        // combine router.query and query props
        // query: {
        //   ...router.query,
        //   ...query,
        // },
        query: searchParams?.toString(),
      }}
    />
  );
};
export default RetainQueryLink;
