---
summary: Realizar 14 rondas de AES Decryption Flow Con Key Locker Usando 256-Bit clave
---

## Descripción

La instrucción AESDEC256KL1 realiza 14 rondas de AES para descifrar el primer operando utilizando la clave de 256 bits indicado por el descriptor del segundo operando. Almacena el resultado en el primer operando si la operación tiene éxito (por ejemplo, no se encuentra en el fallo de violación de un descriptor).

## Operación

```text
AESDEC256KL
Handle := UnalignedLoad of 512 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (HandleReservedBitSet (Handle) ||

                   (Handle[0] AND (CPL > 0)) ||
                   Handle [2] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES256);
IF (Illegal Handle)
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate512 (Handle[511:0], IWKey);
          IF (Authentic == 0)
                THEN RFLAGS.ZF := 1;
                ELSE

                      DEST := AES256Decrypt (DEST, UnwrappedKey) ;
                      RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;
```

## Banderas afectadas

ZF se establece a 0 si la operación tuvo éxito y se estableció a 1 si la operación falló debido a la violación de un descriptor. Las otras banderas aritméticas (OF, SF, AF, PF, CF) se limpian a 0.

## Intel C/C++ compilador intrínseco

```c
AESDEC256KL unsigned char _mm_aesdec256kl_u8(__m128i* odata, __m128i idata, const void* h);
```
