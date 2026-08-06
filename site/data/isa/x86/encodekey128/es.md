---
summary: Código 128-Bit clave con Key Locker
---

## Descripción

La instrucción ENCODEKEY1281 envuelve un AES clave de 128 bits del implícito operando XMM0 a una clave descriptor que se almacena en el implícito operandos de destino XMM0-2.

El operando de origen explícito especifica las restricciones descriptor, si las hay.

El operando de destino explícito se pobla con información sobre la fuente de la clave y sus atributos. XMM4 a través de XMM6 se reservan para usos futuros y el software no debe confiar en que se estén cero.

## Operación

```text
ENCODEKEY128
#GP (0) if a reserved bit2 in SRC[31:0] is set

InputKey[127:0] := XMM0;

KeyMetadata[2:0] = SRC[2:0];

KeyMetadata[23:3] = 0;        // Reserved for future usage

KeyMetadata[27:24] = 0;       // KeyType is AES-128 (value of 0)

KeyMetadata[127:28] = 0; // Reserved for future usage

// KeyMetadata is the AAD input and InputKey is the Plaintext input for WrapKey128
Handle[383:0] := WrapKey128(InputKey[127:0], KeyMetadata[127:0], IWKey.Integrity Key[127:0], IWKey.Encryption Key[255:0]);

DEST[0] := IWKey.NoBackup;
DEST[4:1] := IWKey.KeySource[3:0];
DEST[31:5] = 0;
XMM0 := Handle[127:0]; // AAD
XMM1 := Handle[255:128]; // Integrity Tag
XMM2 := Handle[383:256]; // CipherText
XMM4 := 0; // Reserved for future usage
XMM5 := 0; // Reserved for future usage
XMM6 := 0; // Reserved for future usage
RFLAGS.OF, SF, ZF, AF, PF, CF := 0;
```

## Banderas afectadas

Todas las banderas aritméticas (OF, SF, ZF, AF, PF, CF) se limpian a 0. Aunque se han aclarado para las operaciones actualmente definidas, las prórrogas futuras pueden informar de información en las banderas.

1. Más detalles sobre Key Locker y el uso de esta instrucción se puede encontrar aquí:

https://software.intel.com/content/www/us/en/develop/download/intel-key-locker-specification.html.

2. SRC[31:3] están actualmente reservados para usos futuros. SRC[2], que indica una restricción de no cifrado, se reserva si CPUID.19H:EAX[2] es 0. SRC[1], que indica una restricción de no cifrado, se reserva si CPUID.19H:EAX[1] es 0. SRC[0], que indica una restricción sólo CPL0, se reserva si CPUID.19H:EAX[0] es 0.

## Intel C/C++ compilador intrínseco

```c
ENCODEKEY128 unsigned int _mm_encodekey128_u32(unsigned int htype, __m128i key, void* h);
```
