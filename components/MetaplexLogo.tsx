import { Box, Flex } from '@mantine/core';

export enum MetaplexLogoVariant {
  Small = 'sm',
  Large = 'lg',
  Raw = 'raw',
}
interface MetaplexLogoProps {
  variant: MetaplexLogoVariant;
}

const MetaplexSvg = () => (
  <svg
    width="50"
    height="32"
    viewBox="0 0 25 12"
    // viewBox="0 0 40 25.6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_3282_1083)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9864 11.1513C12.0904 11.3264 12.0826 11.5462 11.9664 11.7135L9.45272 15.3317C9.23607 15.6436 8.76906 15.6256 8.57709 15.2979L0.0721235 0.782804C-0.130975 0.436184 0.118993 0 0.520733 0H5.06581C5.24926 0 5.41913 0.0966711 5.51283 0.254388L11.9864 11.1513ZM24.1509 15.2178C24.3534 15.5644 24.1034 16 23.7019 16H19.1846C19 16 18.8293 15.9022 18.736 15.7429L9.97028 0.782804C9.76718 0.436184 10.0172 0 10.4189 0H14.9615C15.1463 0 15.3172 0.0980899 15.4104 0.257653L24.1509 15.2178ZM3.65815 15.8585C4.06114 15.8585 4.31094 15.4199 4.10533 15.0733L0.98874 9.8196C0.71899 9.36488 0.0216101 9.55616 0.0216101 10.0849V15.3386C0.0216101 15.6257 0.254398 15.8585 0.541557 15.8585H3.65815Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_3282_1083">
        <rect width="24.6667" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const MetaplexLogo: React.FC<MetaplexLogoProps> = ({
  variant,
}: MetaplexLogoProps) => {
  if (variant === MetaplexLogoVariant.Raw) {
    return <MetaplexSvg />;
  }

  return (
    <Flex>
      <Box
        className="metaplex-logo-m"
        mr={{
          mobile: 4.5,
          tablet: 10,
          desktop: 4.5,
        }}
      >
        <MetaplexSvg />
      </Box>
      {variant === MetaplexLogoVariant.Large && (
        <svg
          width="141"
          height="16"
          viewBox="0 0 141 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 16H2.64167V5.41714L8.78238 16H11.0301L17.1708 5.41714V16H19.8125V0H17.2172L9.91783 12.6171L2.59532 0H0V16Z"
            fill="white"
          />
          <path
            d="M25.9509 16H36.17V13.3943H28.5926V9.30286H36.17V6.69714H28.5926V2.60571H36.17V0H25.9509V16Z"
            fill="white"
          />
          <path
            d="M46.2814 16H48.923V2.60571H55.0406V0H40.1406V2.60571H46.2814V16Z"
            fill="white"
          />
          <path
            d="M70.8292 16H73.7258L66.1947 0H63.6226L56.0915 16H58.9881L60.2857 13.2114H69.5084L70.8292 16ZM61.5139 10.6057L64.8971 3.40571L68.2803 10.6057H61.5139Z"
            fill="white"
          />
          <path
            d="M78.3002 16H80.9419V10.9714H84.3482C87.5924 10.9714 89.9328 8.66286 89.9328 5.48571C89.9328 2.33143 87.5924 0 84.3482 0H78.3002V16ZM80.9419 8.36572V2.60571H84.3482C86.063 2.60571 87.2912 3.81714 87.2912 5.48571C87.2912 7.15429 86.063 8.36572 84.3482 8.36572H80.9419Z"
            fill="white"
          />
          <path
            d="M94.9278 16H105.286V13.3943H97.5695V0H94.9278V16Z"
            fill="white"
          />
          <path
            d="M109.926 16H120.145V13.3943H112.568V9.30286H120.145V6.69714H112.568V2.60571H120.145V0H109.926V16Z"
            fill="white"
          />
          <path
            d="M124.278 16H127.684L132.551 10.08L137.394 16H140.8L134.242 8L140.8 0H137.417L132.551 5.92L127.684 0H124.278L130.836 8L124.278 16Z"
            fill="white"
          />
        </svg>
      )}
    </Flex>
  );
};
