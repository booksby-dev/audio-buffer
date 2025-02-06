/**
 * AudioBuffer class
 */
interface AudioBufferOptions {
  length: number;
  sampleRate: number;
  numberOfChannels?: number;
}

class CustomAudioBuffer {
  readonly sampleRate: number;
  readonly numberOfChannels: number;
  readonly length: number;
  readonly duration: number;
  private _data: Float32Array;
  private _channelData: Float32Array[];

  /**
   * Create AudioBuffer instance.
   * @constructor
   * @param {AudioBufferOptions} options - buffer init options.
   */
  constructor(options: AudioBufferOptions) {
    if (!options) throw TypeError("options argument is required");
    if (!options.sampleRate) throw TypeError("options.sampleRate is required");
    if (options.sampleRate < 3000 || options.sampleRate > 768000)
      throw TypeError("options.sampleRate must be within 3000..768000");
    if (!options.length) throw TypeError("options.length must be more than 0");

    this.sampleRate = options.sampleRate;
    this.numberOfChannels = options.numberOfChannels || 1;
    this.length = options.length | 0;
    this.duration = this.length / this.sampleRate;

    //data is stored as a planar sequence
    this._data = new Float32Array(this.length * this.numberOfChannels);

    //channels data is cached as subarrays
    this._channelData = [];
    for (let c = 0; c < this.numberOfChannels; c++) {
      this._channelData.push(
        this._data.subarray(c * this.length, (c + 1) * this.length)
      );
    }
  }

  /**
   * Return data associated with the channel.
   * @param {number} channel - Channel index, starting from 0.
   * @return {Float32Array} Array containing the data.
   */
  getChannelData(channel: number): Float32Array {
    if (channel >= this.numberOfChannels || channel < 0 || channel == null) {
      throw Error(
        `Cannot getChannelData: channel number (${channel}) exceeds number of channels (${this.numberOfChannels})`
      );
    }
    return this._channelData[channel];
  }

  /**
   * Place data to the destination buffer, starting from the position.
   * @param {Float32Array} destination - Destination array to write data to.
   * @param {number} channelNumber - Channel to take data from.
   * @param {number} startInChannel - Data offset in channel to read from.
   */
  copyFromChannel(
    destination: Float32Array,
    channelNumber: number,
    startInChannel: number = 0
  ): void {
    const data = this._channelData[channelNumber];
    for (
      let i = startInChannel, j = 0;
      i < this.length && j < destination.length;
      i++, j++
    ) {
      destination[j] = data[i];
    }
  }

  /**
   * Place data from the source to the channel, starting (in self) from the position.
   * @param {Float32Array | Array} source - source array to read data from.
   * @param {number} channelNumber - channel index to copy data to.
   * @param {number} startInChannel - offset in channel to copy data to.
   */
  copyToChannel(
    source: Float32Array | number[],
    channelNumber: number,
    startInChannel: number = 0
  ): void {
    const data = this._channelData[channelNumber];
    for (
      let i = startInChannel, j = 0;
      i < this.length && j < source.length;
      i++, j++
    ) {
      data[i] = source[j];
    }
  }
}

export = CustomAudioBuffer;
