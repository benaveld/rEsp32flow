export function merge(lists: any[][]) {
  let result: any[] = [];
  lists.forEach((value) => {
    if (value.length > 0) {
      if (result.length > 0) {
        result = [...result, ...value];
      } else {
        result = value;
      }
    }
  });
  return result;
}
