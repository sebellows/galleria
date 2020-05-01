function chunk(arr, size) {
  const chunkedArr = [];
  let index = 0;
  while (index < arr.length) {
    chunkedArr.push(arr.slice(index, size + index));
    index += size;
  }
  return chunkedArr;
}

module.exports = function filterPhotos(
  { photos: data },
  { pageNumber = 1, limit = 8, ownername, title },
) {
  let records = data.photo;

  const intLimit = parseInt(limit, 10);
  const intOffset = parseInt(pageNumber - 1, 10);

  if (ownername) {
    const ownerRE = new RegExp(ownername.toLowerCase(), 'i');
    records = records.filter((photo) => ownerRE.test(photo.ownername));
  }

  if (title) {
    const titleRE = new RegExp(title.toLowerCase(), 'i');
    records = records.filter((photo) => titleRE.test(photo.title));
  }

  const photos = chunk(records, intLimit)[intOffset];

  return { totalPhotos: records.length, photos };
};
