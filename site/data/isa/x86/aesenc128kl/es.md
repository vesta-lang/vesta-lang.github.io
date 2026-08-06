---
summary: Realizar Diez rondas de AES Encryption Flow Con Key Locker Usando 128-Bit clave
---

## Descripción

La instrucción AESENC128KL1 realiza diez rondas de AES para cifrar el primer operando utilizando la clave de 128 bits indi-

abastecido por el descriptor del segundo operando. Almacena el resultado en el primer operando si la operación tiene éxito

(por ejemplo, no se encuentra en un fallo de violación de un descriptor).

## Operación

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

## Banderas afectadas

ZF se establece a 0 si la operación tuvo éxito y se estableció a 1 si la operación falló debido a la violación de un descriptor. Las otras banderas aritméticas (OF, SF, AF, PF, CF) se limpian a 0.

## Intel C/C++ compilador intrínseco

```c
AESENC128KL unsigned char _mm_aesenc128kl_u8(__m128i* odata, __m128i idata, const void* h);
```
