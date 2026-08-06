---
summary: Realizar Diez rondas de AES Decryption Flow Con Key Locker en 8 bloques
---

## Descripción

La instrucción AESDECWIDE128KL1 realiza diez rondas de AES para descifrar cada uno de los ocho bloques en XMM0-7 utilizando la clave de 128 bits indicado por el descriptor del segundo operando. Reemplaza cada bloque de entrada en XMM0-7 con su bloque descifrado correspondiente si la operación tiene éxito (por ejemplo, no se encuentra en fallo de violación un descriptor).

## Operación

```text
AESDECWIDE128KL
Handle := UnalignedLoad of 384 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (HandleReservedBitSet (Handle) ||

                   (Handle[0] AND (CPL > 0)) ||
                   Handle [2] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES128);
IF (Illegal Handle)
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate384 (Handle[383:0], IWKey);
          IF Authentic == 0 {
                THEN RFLAGS.ZF := 1;
                ELSE

                      XMM0 := AES128Decrypt (XMM0, UnwrappedKey) ;
                      XMM1 := AES128Decrypt (XMM1, UnwrappedKey) ;
                      XMM2 := AES128Decrypt (XMM2, UnwrappedKey) ;
                      XMM3 := AES128Decrypt (XMM3, UnwrappedKey) ;
                      XMM4 := AES128Decrypt (XMM4, UnwrappedKey) ;
                      XMM5 := AES128Decrypt (XMM5, UnwrappedKey) ;
                      XMM6 := AES128Decrypt (XMM6, UnwrappedKey) ;
                      XMM7 := AES128Decrypt (XMM7, UnwrappedKey) ;
                      RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;
```

## Banderas afectadas

ZF se establece a 0 si la operación tuvo éxito y se estableció a 1 si la operación falló debido a la violación de un descriptor. Las otras banderas aritméticas (OF, SF, AF, PF, CF) se limpian a 0.

1. Más detalles sobre Key Locker y el uso de esta instrucción pueden encontrarse aquí: https://software.intel.com/content/www/us/en/develop/download/intel-clave-locker-specification.html.

## Intel C/C++ compilador intrínseco

```c
AESDECWIDE128KLunsigned char _mm_aesdecwide128kl_u8(__m128i odata[8], const __m128i idata[8], const void* h);
```
