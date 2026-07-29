declare module 'qrcode' {
  export interface QRCodeOptions {
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toDataURL(text: string, options?: QRCodeOptions): Promise<string>;
  export function toDataURL(text: string, options: QRCodeOptions, callback: (err: Error | null, url: string) => void): void;
}
