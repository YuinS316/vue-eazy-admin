import fg from 'fast-glob';

export function getPagePath() {
  const files = fg.globSync('src/views/**/*.vue');

  return files;
}
