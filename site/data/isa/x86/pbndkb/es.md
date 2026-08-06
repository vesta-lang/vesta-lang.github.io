---
summary: Plataforma Bind clave a Objetos Grandes binarios
---

## Descripción

La instrucción PBNDKB permite que el software ata la información a una plataforma encriptándola con una clave de envoltura específico de plataforma. Los datos cifrados pueden ser utilizados posteriormente por la instrucción PCONFIG para configurar el motor total de cifrado de almacenamiento (TSE).

La instrucción se puede ejecutar sólo en modo de 64 bits. Los registros RBX y RCX proporcionan información de entrada a la instrucción. Las ejecuciones de PBNDKB pueden fallar por razones específicas de la plataforma. Un fallo de ejecución reporta la fijación de la bandera ZF y la carga de EAX con una razón de fracaso no cero; una ejecución exitosa aclara ZF y EAX.

La instrucción funciona en estructuras de datos de 256 bytes llamadas estructuras bind. Lee una estructura de unión en la dirección lineal en RBX y escribe una estructura de unión modificada a la dirección lineal en RCX. Las direcciones en RBX y RCX deben ser diferentes entre sí y deben ser alineadas de 256 bytes.

La instrucción encripta una porción de la estructura de bind de entrada y genera un MAC de partes de esa estructura. Los datos cifrados y MAC están escritos como parte de la estructura de unión de salida.

El formato de una estructura bind se da en el cuadro 4-13.

** Formato de estructura de la bicicleta**

| Campo | Offset (bytes) | Tamaño (bytes) | Comentarios |
| --- | --- | --- | --- |
| MAC | 0 | 16 | Producto de PBNDKB como MAC basado en la estructura de la unión de entrada |
| Reservado | 16 | 8 | Reservado; debe ser cero en la entrada, la salida como cero |
| IV | 24 | 12 | Vector de inicialización generado y salida por PBNDKB |
| Reservado | 36 | 28 | Reservado; debe ser cero en la entrada, la salida como cero |
| BTENCDATA | 64 | 64 | Datos de cifrado (plictexto de entrada; cifrado de salida) |
| BTDATA | 128 | 128 | Control y datos adicionales (modificados pero no cifrados) |

## Operación

```text
(* #UD if PBNDKB is not enumerated, CPL > 0, or not in 64-bit mode*)
IF CPUID.(EAX=07H, ECX=01H):EBX.PBNDKB[bit 1] = 0 OR CPL > 0 OR not in 64-bit mode

    THEN #UD; FI;

(* #GP if pointers are not aligned or overlapping *)
IF RBX = RCX OR RBX is not 256-byte aligned OR RCX is not 256-byte aligned

    THEN #GP(0); FI;

Load TMP_BIND_STRUCT from 256 bytes at linear address in RBX;
(* MAC and IV fields might not be read. *)

(* Check TMP_BIND_STRUCT for illegal values *)
IF bytes 23:16 and bytes 63:36 of TMP_BIND_STRUCT are not all zero

    THEN #GP(0); FI;
IF TMP_BIND_STRUCT.BTDATA.KEY_GENERATION_CTRL > 1

    THEN #GP(0); FI;
IF bytes 127:33 of TMP_BIND_STRUCT.BTDATA are not all zero

    THEN #GP(0); FI;

(* Randomize input keys if requested *)
IF TMP_BIND_STRUCT.BTDATA.KEY_GENERATION_CONTROL= 1

    THEN
          Load RNG_DATA_KEY with a random 256-bit value using hardware RNG;
          Load RNG_TWEAK_KEY with a random 256-bit value using hardware RNG;
          IF there was insufficient entropy
                THEN (* PBNDKB failure *)
                      RFLAGS.ZF := 1;
                      RAX := ENTROPY_ERROR; (* failure reason 1 *)
                GOTO EXIT;
          FI;


          (* XOR the input keys with the random keys; this does not modify input bind structure in memory *)
          TMP_BIND_STRUCT.BTENCDATA.DATA_KEY := RNG_DATA_KEY XOR TMP_BIND_STRUCT.BTENCDATA.DATA_KEY;
          TMP_BIND_STRUCT.BTENCDATA.TWEAK_KEY := RNG_TWEAK_KEY XOR TMP_BIND_STRUCT.BTENCDATA.TWEAK_KEY;
FI;

(* Compute wrapping key from platform key and user challenge *)
PLATFORM_KEY := 256-bit platform-specific key;
WRAPPING_KEY := HMAC_SHA256(PLATFORM_KEY, TMP_BIND_STRUCT.BTDATA.USER_SUPP_CHALLENGE);

(* Generate random data for initialization vector *)
Load TMP_IV with a random 96-bit value using hardware RNG;
IF there was insufficient entropy

    THEN (* PBNDKB failure *)
          RFLAGS.ZF := 1;
          RAX := ENTROPY_ERROR; (* failure reason 1 *)
          GOTO EXIT;

FI;

(* Compose 176 bytes of additional authenticated data for use by authenticated decryption *)
AAD := Concatenation of 8 bytes of zeroes, TMP_IV, 28 bytes of zeroes, and TMP_BIND_STRUCT.BTDATA;

ENCRYPT_STRUCT := AES256_GCM_ENC(TMP_BIND_STRUCT.BTENCDATA, WRAPPING_KEY, TMP_IV, AAD, 176);

OUT_BIND_STRUCT.MAC := ENCRYPT_STRUCT.MAC;
OUT_BIND_STRUCT[bytes 23:16] := 0;
OUT_BIND_STRUCT.IV := TMP_IV;
OUT_BIND_STRUCT[bytes 63:36] := 0;
OUT_BIND_STRUCT.BTENCDATA := ENCRYPT_STRUCT.ENC_DATA;
OUT_BIND_STRUCT.BTDATA.USER_SUPP_CHALLENGE := 0;
OUT_BIND_STRUCT.BTDATA.KEY_GENERATION_CTRL := IN_BIND_STRUCT.BTDATA.KEY_GENERATION_CTRL;
OUT_BIND_STRUCT.BTDATA[bytes 127:33] := 0;

(* Save OUT_BIND_STRUCT to memory *)
Store OUT_BIND_STRUCT to 256 bytes at linear address in RCX;

(* Indicate successful completion *)
RAX := 0;
RFLAGS.ZF := 0;

EXIT:
RFLAGS.CF := 0;
RFLAGS.PF := 0;
RFLAGS.AF := 0;
RFLAGS.OF := 0;
RFLAGS.SF := 0;
```
