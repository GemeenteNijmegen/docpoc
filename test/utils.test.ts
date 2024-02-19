import { getFileSizeForBase64String } from '../src/utils';

describe('Test base64 calculations', () => {
  test('Decoding a known file size', async() => {
    const string = 'dGVzdAo=';
    expect(getFileSizeForBase64String(string)).toBe(5);
  });
  test('Decoding a known file size', async() => {
    const string = 'dGVzdGEK';
    expect(getFileSizeForBase64String(string)).toBe(6);
  });

  test('Decoding a known file sizes (7 bytes)', async() => {
    const string = 'dGVzdGFhCg==';
    expect(getFileSizeForBase64String(string)).toBe(7);
  });

  test('Decoding a known file sizes (7 bytes)', async() => {
    const string = 'dGVzdGFhCg==';
    expect(getFileSizeForBase64String(string)).toBe(7);
  });
});
