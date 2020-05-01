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
  { pageNumber = 1, limit = 8, ...queries },
) {
  let results = data.photo;

  const intLimit = parseInt(limit, 10);
  const intOffset = parseInt(pageNumber - 1, 10);
  const queryKeys = ['description', 'ownername', 'title'];

  for (const query in queries) {
    if (queryKeys.includes(query)) {
      const queryRE = new RegExp(queries[query].toLowerCase(), 'i');
      results = results.filter((photo) => queryRE.test(photo[query]));
    }
  }

  const pages = chunk(results, intLimit) || [];
  const photos = chunk(results, intLimit)[intOffset];

  return { totalPhotos: results.length, pages: pages.length, photos };
};
