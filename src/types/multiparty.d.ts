declare module 'multiparty' {
  class Form {
    parse(req: any, callback: (err: any, fields: { [key: string]: any }, files: { [key: string]: any }) => void): void;
  }
}
