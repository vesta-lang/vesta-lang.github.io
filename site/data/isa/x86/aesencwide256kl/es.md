---
summary: Realizar 14 rondas de AES Encryption Flow Con Key Locker en 8 bloques
---

## Descripción

La instrucción AESENCWIDE256KL1 realiza 14 rondas de AES para cifrar cada uno de los ocho bloques en XMM0-7

usando la clave de 256 bits indicado por el descriptor del segundo operando. Reemplaza cada bloque de entrada en XMM0-7

con su bloque encriptado correspondiente si la operación tiene éxito (por ejemplo, no se encuentra en fallo de violación un descriptor).

## Operación

```text
AESENCWIDE256KL
Handle := UnalignedLoad of 512 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (

                   HandleReservedBitSet (Handle) ||
                   (Handle[0] AND (CPL > 0)) ||
                   Handle [1] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES256
                   );
IF (Illegal Handle)
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate512 (Handle[511:0], IWKey);
          IF (Authentic == 0)
                THEN RFLAGS.ZF := 1;
                ELSE

                      XMM0 := AES256Encrypt (XMM0, UnwrappedKey) ;
                      XMM1 := AES256Encrypt (XMM1, UnwrappedKey) ;
                      XMM2 := AES256Encrypt (XMM2, UnwrappedKey) ;
                      XMM3 := AES256Encrypt (XMM3, UnwrappedKey) ;
                      XMM4 := AES256Encrypt (XMM4, UnwrappedKey) ;
                      XMM5 := AES256Encrypt (XMM5, UnwrappedKey) ;
                      XMM6 := AES256Encrypt (XMM6, UnwrappedKey) ;
                      XMM7 := AES256Encrypt (XMM7, UnwrappedKey) ;
                      RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;

1. Further details on Key Locker and usage of this instruction can be found here:
     https://software.intel.com/content/www/us/en/develop/download/intel-key-locker-specification.html.
```

## Banderas afectadas

ZF se establece a 0 si la operación tuvo éxito y se estableció a 1 si la operación falló debido a la violación de un descriptor. Las otras banderas aritméticas (OF, SF, AF, PF, CF) se limpian a 0.

## Intel C/C++ compilador intrínseco

```c
AESENCWIDE256KLunsigned char _mm_aesencwide256kl_u8(__m128i odata[8], const __m128i idata[8], const void* h);
```
