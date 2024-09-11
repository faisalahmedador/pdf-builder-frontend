export function getUrl(production = false) {
  return production ? 'https://pdf-backend.jotno.dev' : 'http://localhost:3001';
}
