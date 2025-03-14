// Type declarations for Deno and external modules used in Edge Functions

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): Record<string, string>;
  }
  
  export const env: Env;
}

declare module "std/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "pdfjs" {
  export const getDocument: (params: { data: Uint8Array }) => { promise: Promise<PDFDocumentProxy> };
  export const GlobalWorkerOptions: { workerSrc: string };
  
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }
  
  export interface PDFPageProxy {
    getTextContent(): Promise<PDFTextContent>;
  }
  
  export interface PDFTextContent {
    items: Array<{ str: string }>;
  }
}

declare module "openai" {
  export class OpenAI {
    constructor(options: { apiKey: string });
    chat: {
      completions: {
        create(params: {
          model: string;
          messages: Array<{ role: string; content: string }>;
          temperature?: number;
          max_tokens?: number;
          response_format?: { type: string };
        }): Promise<{
          choices: Array<{
            message: { content: string };
          }>;
        }>;
      };
    };
  }
}
