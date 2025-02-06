import CustomAudioBuffer = require("./index");
import tape = require("tape");

tape("options", function (t: any) {
  const b3 = new CustomAudioBuffer({
    length: 220.5,
    sampleRate: 44100,
    numberOfChannels: 1,
  });
  t.equal(b3.length, 220);

  const buffer1 = new CustomAudioBuffer({
    length: 441,
    sampleRate: 44100,
    numberOfChannels: 1,
  });
  t.equal(buffer1.duration, 0.01);

  const buffer2 = new CustomAudioBuffer({
    length: 441,
    sampleRate: 44100 * 2,
    numberOfChannels: 1,
  });
  t.equal(buffer2.duration, 0.005);

  t.end();
});

tape("getChannelData empty arrays", function (t: any) {
  const buffer = new CustomAudioBuffer({
    length: 4,
    sampleRate: 44100,
    numberOfChannels: 1,
  });
  t.deepEqual([...buffer.getChannelData(0)], [0, 0, 0, 0]);
  t.end();
});

tape("copyToChannel", function (t: any) {
  const a = new CustomAudioBuffer({
    numberOfChannels: 2,
    length: 40,
    sampleRate: 44100,
  });
  const arr = new Float32Array(40);
  arr.fill(-0.5);

  a.copyToChannel(arr, 0, 0);
  t.deepEqual(arr, a.getChannelData(0));

  a.copyToChannel(arr, 1, 10);
  const zeros = new Float32Array(10);
  arr.set(zeros);
  t.deepEqual(arr, a.getChannelData(1));

  t.end();
});

tape("copyFromChannel", function (t: any) {
  const a = new CustomAudioBuffer({
    numberOfChannels: 2,
    length: 40,
    sampleRate: 44100,
  });
  const arr = new Float32Array(40);
  a.getChannelData(0).fill(-0.5);
  a.getChannelData(1).fill(0.5);
  a.getChannelData(1).set(new Float32Array(20).fill(-0.5), 20);

  a.copyFromChannel(arr, 0);
  t.deepEqual(arr, a.getChannelData(0));

  a.copyFromChannel(arr, 1, 10);
  const fixture = Array(10).fill(0.5).concat(Array(30).fill(-0.5));
  t.deepEqual([...arr], fixture);

  t.end();
});
