import {type CryptoEnv} from '#/crypto.env';
import {CryptoService} from '#/crypto.service';

function makeSut() {
  const cryptoEnv = {PACKAGES_NEST_CRYPTO_KEY: ''.padStart(32, 'a')};
  const sut = new CryptoService(cryptoEnv as unknown as CryptoEnv);
  return {sut};
}

describe('CryptoService', () => {
  it('contains cryptoEnv', () => {
    const {sut} = makeSut();
    expect(sut.cryptoEnv).toBeDefined();
  });

  describe('createHash', () => {
    it('creates a SHA-256 hash of a plain text', () => {
      const {sut} = makeSut();
      expect(sut.hash('hello')).toBeDefined();
    });
  });

  describe('encrypt', () => {
    it('returns a string in format iv.encrypted.tag', () => {
      const {sut} = makeSut();
      expect(sut.encrypt('data')).toBeDefined();
    });
  });

  describe('decrypt', () => {
    it('decrypts correctly a valid cipher text', () => {
      const {sut} = makeSut();
      const original = 'sensitive data';
      const encrypted = sut.encrypt(original);
      const decrypted = sut.decrypt(encrypted);
      expect(decrypted).toBe(original);
    });

    it('throws when decrypting with malformed cipherText', () => {
      const {sut} = makeSut();
      expect(() => sut.decrypt('invalid')).toThrow(TypeError);
      expect(() => sut.decrypt('invalid')).toThrow('Invalid cipherText format');
    });

    it('throws when decrypting with invalid tag', () => {
      const {sut} = makeSut();
      const encrypted = sut.encrypt('data');
      const parts = encrypted.split('.');
      parts[2] = 'tamperedtag';
      const tampered = parts.join('.');
      expect(() => sut.decrypt(tampered)).toThrow(TypeError);
    });

    it('throws when decrypting with invalid iv', () => {
      const {sut} = makeSut();
      const encrypted = sut.encrypt('data');
      const parts = encrypted.split('.');
      parts[0] = 'short';
      const tampered = parts.join('.');
      expect(() => sut.decrypt(tampered)).toThrow(TypeError);
    });

    it('throws when decrypting with invalid encrypted data', () => {
      const {sut} = makeSut();
      const encrypted = sut.encrypt('data');
      const parts = encrypted.split('.');
      parts[1] = 'invalidcipher';
      const tampered = parts.join('.');
      expect(() => sut.decrypt(tampered)).toThrow(TypeError);
    });
  });
});
