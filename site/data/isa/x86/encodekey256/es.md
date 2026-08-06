---
summary: Código 256-Bit clave con Key Locker
---

## Descripción

La instrucción ENCODEKEY2561 envuelve un AES clave de 256 bits del implícito operando XMM1:XMM0 en una clave descriptor que se almacena en el implícito operandos de destino XMM0-3.

El operando de origen explícito es un registro de proposito general y especifica qué restricciones descriptor deben ser construidas en el descriptor.

El operando de destino explícito se pobla con información sobre la fuente de la clave y sus atributos. XMM4 a través de XMM6 se reservan para usos futuros y el software no debe confiar en que se estén cero.

## Operación

```text
ENCODEKEY256
#GP (0) if a reserved bit2 in SRC[31:0] is set
InputKey[255:0] := XMM1:XMM0;
KeyMetadata[2:0] = SRC[2:0];
KeyMetadata[23:3] = 0; // Reserved for future usage
KeyMetadata[27:24] = 1; // KeyType is AES-256 (value of 1)
KeyMetadata[127:28] = 0; // Reserved for future usage

// KeyMetadata is the AAD input and InputKey is the Plaintext input for WrapKey256
Handle[511:0] := WrapKey256(InputKey[255:0], KeyMetadata[127:0], IWKey.Integrity Key[127:0], IWKey.Encryption Key[255:0]);

DEST[0] := IWKey.NoBackup;
DEST[4:1] := IWKey.KeySource[3:0];
DEST[31:5] = 0;
XMM0 := Handle[127:0]; // AAD
XMM1 := Handle[255:128]; // Integrity Tag
XMM2 := Handle[383:256]; // CipherText[127:0]
XMM3 := Handle[511:384]; // CipherText[255:128]

XMM4 := 0; // Reserved for future usage
XMM5 := 0; // Reserved for future usage
XMM6 := 0; // Reserved for future usage

RFLAGS.OF, SF, ZF, AF, PF, CF := 0;

1. Further details on Key Locker and usage of this instruction can be found here:

    https://software.intel.com/content/www/us/en/develop/download/intel-key-locker-specification.html.

2. SRC[31:3] are currently reserved for future usages. SRC[2], which indicates a no-decrypt restriction, is reserved if
    CPUID.19H:EAX[2] is 0. SRC[1], which indicates a no-encrypt restriction, is reserved if CPUID.19H:EAX[1] is 0. SRC[0], which indicates
    a CPL0-only restriction, is reserved if CPUID.19H:EAX[0] is 0.
```

## Banderas afectadas

Todas las banderas aritméticas (OF, SF, ZF, AF, PF, CF) se limpian a 0. Aunque se han aclarado para las operaciones actualmente definidas, las prórrogas futuras pueden informar de información en las banderas.

## Intel C/C++ compilador intrínseco

```c
ENCODEKEY256 unsigned int _mm_encodekey256_u32(unsigned int htype, __m128i key_lo, __m128i key_hi, void* h);
```
