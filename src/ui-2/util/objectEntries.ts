export default function objectEntries<T>(obj: {
  [key: string]: T;
}): [string, T][] {
  return Object.keys(obj).map((key) => {
    // XXX: explicit annotation needed here because otherwise it thinks it's
    // just Object[]. shouldn't be needed if SerializedComponent becomes a
    // more specific interface
    const pair: [string, T] = [key, obj[key]];
    return pair;
  });
}
