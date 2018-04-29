export default function removeDuplicates(myArr, prop) {
  return myArr.filter(
    (obj, pos, arr) => arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
  );
}
