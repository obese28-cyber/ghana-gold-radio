declare module '@/next.config.js' {
  interface SecurityHeader {
    key: string;
    value: string;
  }

  interface HeaderGroup {
    source: string;
    headers: SecurityHeader[];
  }

  interface NextConfigShape {
    headers: () => Promise<HeaderGroup[]>;
    poweredByHeader: boolean;
    [key: string]: unknown;
  }

  const config: NextConfigShape;
  export default config;
}
