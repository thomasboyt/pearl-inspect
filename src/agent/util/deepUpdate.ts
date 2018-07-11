export default function deepUpdate(root: any, path: string[], value: any) {
  var obj = root;

  if (path.length > 1) {
    obj = path.slice(0, path.length - 1).reduce((last, piece) => {
      return last[piece];
    }, root);
  }

  var key = path[path.length - 1];
  obj[key] = value;
}
