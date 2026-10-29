import argon2 from 'argon2'

/**
 * Reusable Password Hashing and Verification Utility using Argon2id.
 *
 * Argon2id combines Data-Independent Memory Hard functions (Argon2i)
 * with Data-Dependent Memory Hard functions (Argon2d) for maximum resistance
 * against both side-channel and GPU cracking attacks.
 */

/**
 * Hashes a plaintext password using Argon2id with recommended OWASP memory parameters.
 * Note: Never log or store raw passwords.
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 4,    // 4 threads
  })
}

/**
 * Verifies a plaintext password against an existing Argon2 hash.
 * Returns true if valid, false if invalid or malformed hash.
 * Constant-time comparison is handled internally by argon2.
 */
export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password)
  } catch {
    return false
  }
}
