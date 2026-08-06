---
summary: Perform Ten Rounds of AES Encryption Flow With Key Locker Using 128-Bit Key
---

## Description

The AESENC128KL1 instruction performs ten rounds of AES to encrypt the first operand using the 128-bit key indi-

cated by the handle from the second operand. It stores the result in the first operand if the operation succeeds

(e.g., does not run into a handle violation failure).

## Operation

```text
AESENC128KL
Handle := UnalignedLoad of 384 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (

                   HandleReservedBitSet (Handle) ||
                   (Handle[0] AND (CPL > 0)) ||
                   Handle [1] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES128
                   );
IF (Illegal Handle) {
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate384 (Handle[383:0], IWKey);
          IF (Authentic == 0)
          THEN RFLAGS.ZF := 1;
          ELSE
                DEST := AES128Encrypt (DEST, UnwrappedKey) ;
                RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;
```

## Flags affected

ZF is set to 0 if the operation succeeded and set to 1 if the operation failed due to a handle violation. The other arithmetic flags (OF, SF, AF, PF, CF) are cleared to 0.

## Intel C/C++ compiler intrinsics

```c
AESENC128KL unsigned char _mm_aesenc128kl_u8(__m128i* odata, __m128i idata, const void* h);
```
