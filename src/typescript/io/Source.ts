import { Thenable } from 'bluebird';

/**
 * Basic interface to encapsulate a "source" of data to upload
 *
 * The obvious ones are also included -- files, buffers, strings.
 */
abstract class Source {

  abstract getBuffer(): Thenable<Buffer>;
  abstract getOriginalName(): string;

}

export default Source;
