import {Injectable} from '@nestjs/common';
import crypto from 'crypto';
import {CryptoEnv} from './crypto.env';

@Injectable()
export class CryptoService {
  readonly algorithm = 'aes-256-gcm';
  readonly plainEncoding = 'utf8';
  readonly cipherEncoding = 'base64url';

  constructor(readonly cryptoEnv: CryptoEnv) {}

  createHash(plainText: string): string {
    const hashedText = crypto.createHash('sha256').update(plainText).digest(this.cipherEncoding);
    return hashedText;
  }

  encrypt(plainText: string): string {
    const iv = crypto.randomBytes(12).toString(this.cipherEncoding);
    const cipher = crypto.createCipheriv(this.algorithm, this.cryptoEnv.PACKAGES_NEST_CRYPTO_KEY, iv);
    let encrypted = cipher.update(plainText, this.plainEncoding, this.cipherEncoding);
    encrypted += cipher.final(this.cipherEncoding);
    const tag = cipher.getAuthTag().toString(this.cipherEncoding);
    return [iv, encrypted, tag].join('.');
  }

  decrypt(cipherText: string): string {
    try {
      const [iv, encrypted, tag] = cipherText.split('.');
      const decipher = crypto.createDecipheriv(this.algorithm, this.cryptoEnv.PACKAGES_NEST_CRYPTO_KEY, iv!);
      decipher.setAuthTag(Buffer.from(tag!, this.cipherEncoding));
      let plainText = decipher.update(encrypted!, this.cipherEncoding, this.plainEncoding);
      plainText += decipher.final(this.plainEncoding);
      return plainText;
    } catch {
      throw TypeError('Invalid cipherText format');
    }
  }
}
