---
summary: Carga interna clave de envoltura con Key Locker
---

## Descripción

La instrucción LOADIWKEY1 escribe el Key Locker interno clave de envoltura, que se llama IWKey. Este IWKey es utilizado por las instrucciones ENCODEKEY* para envolver claves en descriptores. Por el contrario, las instrucciones AESENC/DEC*KL utilizan IWKey para desenvolver las claves de los descriptores y ayudar a verificar la integridad el descriptor. Por razones de seguridad, ninguna instrucción está diseñada para permitir que el software lea directamente el valor IWKey.

IWKey incluye dos criptográficos claves así como metadatos. Los dos criptográficos claves están cargados de fuentes de registro para que LOADIWKEY pueda ser ejecutado sin las claves estar en memoria.

La clave entrada operandos son:

* La clave de cifrado de 256 bits está cargado de los dos operandos explícitos. * La integridad de 128 bits clave está cargada de la implícita operando XMM0.

El implícito operando EAX especifica el KeySource y si se permite apoyar a la clave:

* EAX[0] Cuando se establece, no se permite que la clave de envoltura sea inicializado para ser respaldado hasta la plataforma-scopiod

storage.

* EAX[4:1] Esto especifica el KeySource, que es el tipo de clave. Actualmente solo se admiten dos codificacións.

Un KeySource de 0 indica que la entrada la clave operandos descrita anteriormente debe almacenarse directamente como las claves de envoltura interno. LOADIWKEY con un KeySource de 1 tendrá números aleatorios del generador de números aleatorios en chip XORed con los registros fuente (incluyendo XMM0) para que el software que ejecuta el LOADIWKEY no sepa el cifrado e integridad IWKey real claves. El software puede elegir poner datos aleatorios adicionales en los registros de fuentes para que otras fuentes de datos aleatorios se combinen con el valor suministrado por el generador de números aleatorios del hardware. El software siempre debe comprobar ZF después de ejecutar LOADIWKEY con KeySource de 1 ya que esta operación puede fallar debido a que no puede obtener suficientes datos completos del generador de números aleatorios en chip. Ambos KeySource de 0 y 1 especifican que IWKey se utiliza con el algoritmo AES-GCM-SIV. CPUID.19H:ECX[1] enumera soporte para KeySource de 1. Todas las demás codificación KeySource están reservadas.

* EAX[31:5]  Reserved.

1. Más detalles sobre Key Locker y el uso de esta instrucción pueden encontrarse aquí: https://software.intel.com/content/www/us/en/develop/download/intel-clave-locker-specification.html.

## Operación

```text
LOADIWKEY

IF CPL > 0              // LOADKWKEY only allowed at ring 0 (supervisor mode)

     THEN #GP (0); FI;

IF EAX[4:1] > 1         // Reserved KeySource encoding used

     THEN #GP (0); FI;

IF EAX[31:5] != 0       // Reserved bit in EAX is set

     THEN #GP (0); FI;

IF EAX[0] AND (CPUID.19H:ECX[0] == 0) // NoBackup is not supported on this part

     THEN #GP (0); FI;

IF (EAX[4:1] == 1) AND (CPUID.19H:ECX[1] == 0) // KeySource of 1 is not supported on this part

     THEN #GP (0); FI;

IF (EAX[4:1] == 0) // KeySource of 0

     THEN

     IWKey.Encryption Key[127:0] := SRC2[127:0]:

     IWKey.Encryption Key[255:128] := SRC1[127:0];

     IWKey.IntegrityKey[127:0] := XMM0[127:0];

     IWKey.NoBackup = EAX [0];

     IWKey.KeySource = EAX [4:1];

     RFLAGS.ZF := 0;

     ELSE               // KeySource of 1. See RDSEED definition for details of randomness

     IF HW_NRND_GEN.ready == 1                         // Full-entropy random data from RDSEED hardware block was received

            THEN

                   IWKey.Encryption Key[127:0] := SRC2[127:0] XOR HW_NRND_GEN.data[127:0];

                   IWKey.Encryption Key[255:128] := SRC1[127:0] XOR HW_NRND_GEN.data[255:128];

                   IWKey.IntegrityKey[127:0] := XMM0[127:0] XOR HW_NRND_GEN.data[383:256];

                   IWKey.NoBackup = EAX [0];

                   IWKey.KeySource = EAX [4:1];

                   RFLAGS.ZF := 0;

            ELSE        // Random data was not returned from RDSEED hardware block. IWKey was not loaded

                   RFLAGS.ZF := 1;

     FI;

FI;

RFLAGS.OF, SF, AF, PF, CF := 0;
```

## Banderas afectadas

ZF se establece a 0 si la operación tuvo éxito y se fijó a 1 si la operación falló debido a los datos aleatorios completos entropía que no se reciben de RDSEED. Las otras banderas aritméticas (OF, SF, AF, PF, CF) se limpian a 0.

## Intel C/C++ compilador intrínseco

```c
LOADIWKEY void _mm_loadiwkey(unsigned int ctl, __m128i intkey, __m128i enkey_lo, __m128i enkey_hi);
```
