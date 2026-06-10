const {TextDecoder, TextEncoder} = require('node:util');
const {TestEnvironment} = require('jest-environment-jsdom');

class CustomJSDOMEnvironment extends TestEnvironment {
  async setup() {
    await super.setup();

    Object.assign(this.global, {
      Blob: globalThis.Blob,
      BroadcastChannel: globalThis.BroadcastChannel,
      fetch: globalThis.fetch,
      File: globalThis.File,
      FormData: globalThis.FormData,
      Headers: globalThis.Headers,
      ReadableStream: globalThis.ReadableStream,
      Request: globalThis.Request,
      Response: globalThis.Response,
      TextDecoder,
      TextEncoder,
      TransformStream: globalThis.TransformStream,
      URL: globalThis.URL,
      URLSearchParams: globalThis.URLSearchParams,
      WritableStream: globalThis.WritableStream,
    });
  }
}

module.exports = CustomJSDOMEnvironment;
