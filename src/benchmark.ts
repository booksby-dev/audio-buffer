/**
 * Test flat over nested implementations
 *
 * Results.
 * Nested implementation is just a bit slower to create than plain typed array, but way faster to access/write channel data. We can cache subarrays to avoid that.
 *
 */
import tape = require("tape");

class Nested {
  private data: Float32Array[];

  constructor(ch: number, len: number) {
    this.data = [];
    for (let i = 0; i < ch; i++) {
      this.data[i] = new Float32Array(len);
    }
  }

  getChannelData(c: number): Float32Array {
    return this.data[c];
  }
}

class Flat {
  private data: Float32Array;
  private channels: Float32Array[];
  readonly length: number;

  constructor(ch: number, len: number) {
    this.length = len;
    this.data = new Float32Array(ch * len);
    this.channels = [];
    for (let i = 0; i < ch; i++) {
      this.channels[i] = this.data.subarray(i * len, (i + 1) * len);
    }
  }

  getChannelData(c: number): Float32Array {
    return this.channels[c];
  }
}

//test
const N = 1e4;

tape("flat create", (t: any) => {
  console.time("flat create");

  for (let i = N; i--; ) {
    new Flat(4, i);
  }

  console.timeEnd("flat create");

  t.end();
});

tape("nested create", (t: any) => {
  console.time("nested create");

  for (let i = N; i--; ) {
    new Nested(4, i);
  }

  console.timeEnd("nested create");

  t.end();
});

tape("nested getChannelData", (t: any) => {
  console.time("nested getChannelData");

  const a = new Nested(4, 1e5);
  for (let i = N; i--; ) {
    a.getChannelData(Math.floor(Math.random() * 4));
  }

  console.timeEnd("nested getChannelData");

  t.end();
});

tape("flat getChannelData", (t: any) => {
  console.time("flat getChannelData");

  const a = new Flat(4, 1e5);
  for (let i = N; i--; ) {
    a.getChannelData(Math.floor(Math.random() * 4));
  }

  console.timeEnd("flat getChannelData");

  t.end();
});
