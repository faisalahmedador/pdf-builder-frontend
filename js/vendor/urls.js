export function getUrl(production = false) {
  return production ? 'http://172.16.248.151:3000' : 'http://localhost:3000';
}
