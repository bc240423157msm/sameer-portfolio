import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

export function createTotpSecret(): string {
  return generateSecret();
}

export function verifyTotpCode(secret: string, code: string): boolean {
  try {
    const result = verifySync({ secret, token: code.replace(/\s/g, "") });
    return result.valid === true;
  } catch {
    return false;
  }
}

export function getTotpUri(secret: string, username: string, issuer = "Sameer Portfolio") {
  return generateURI({ issuer, label: username, secret });
}

export async function getTotpQrDataUrl(secret: string, username: string): Promise<string> {
  const uri = getTotpUri(secret, username);
  return QRCode.toDataURL(uri, { width: 200, margin: 2 });
}
