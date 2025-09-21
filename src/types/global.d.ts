export {};

declare global {
  interface Window {
    Kakao?: {
      isInitialized?: () => boolean;
      Auth: {
        login: (options: { scope?: string }) => Promise<unknown>;
      };
    };
  }
}


