export default function isNode() {
  // tslint:disable-next-line:max-line-length
  // http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
  return (
    (typeof process !== 'undefined') &&
    (process.release)
    && (process.release.name === 'node')
  );
}
