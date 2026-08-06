---
summary: Configuración de la plataforma
---

## Descripción

La instrucción PCONFIG permite que el software configura ciertas funciones de plataforma. Soporta estas características con múltiples funciones hoja, seleccionando la función una hoja utilizando el valor en EAX.

Dependiendo de la función la hoja, los registros RBX, RCX y RDX pueden utilizarse para proporcionar información de entrada o para la instrucción para informar de la información de salida. Las direcciones y operandos son 32 bits fuera del modo 64-bit y son 64 bits en modo 64-bit. El valor de CS.D no afecta a tamaño de operando o tamaño de la dirección.

Las ejecuciones de PCONFIG pueden fallar por razones específicas de la plataforma. Un fallo de ejecución reporta la fijación de la bandera ZF y la carga de EAX con una razón de fracaso no cero; una ejecución exitosa aclara ZF y EAX.

Cada función PCONFIG hoja se aplica a un bloque de hardware específico llamado blanco PCONFIG. La función la hoja solo se soporta si el procesador soporta ese objetivo. Cada objetivo está asociado con un identificador de objetivos numéricos, y CPUID hoja 1BH (información PCONFIG) enumera los identificadores de los objetivos soportados. Un intento de ejecutar una función hoja no definida, o función una hoja que se aplica a un identificador objetivo no compatible, resulta en una excepción de protección general (#GP).

Función hoja MKTME KEY PROGRAM

La función de hoja PCONFIG 0 (seleccionada mediante la carga de EAX con valor 0) se utiliza para la programación clave para el cifrado total de memoria-multi-key (TME-MK).1 Esta función de hoja se llama MKTME KEY PROGRAM y pertenece al objetivo TME-MK, que tiene identificador objetivo 1. La función la hoja utiliza el registro EBX (o RBX) para obtener información adicional de entrada.

El software utiliza esta función hoja para administrar la clave de cifrado asociado con un identificador clave particular (KeyID). La función la hoja utiliza una estructura de datos llamada TME-MK clave estructura de programación (MKTME KEY PRO- GRAM STRUCT). El software proporciona la dirección de la estructura (como compensación en el segmento DS) en EBX (o RBX). El formato de la estructura se da en la tabla 4-16.

**MKTME KEY PROGRAM STRUCT Format**

| Campo | Offset (bytes) | Tamaño (bytes) | Comentarios |
| --- | --- | --- | --- |
| KEYID | 0 | 2 | Identificador clave. |
| KEYID_CTRL | 2 | 4 | Control KeyID: *  Bits 7:0: clave-programming command (COMMAND) *  Bits 23:8: algoritmo de cifrado (ENC ALG) *  Bits 31:24: Reservado, debe ser cero (RSVD) |
| Ignorado | 6 | 58 | No se usa. |
| KEY_FIELD_1 | 64 | 64 | El software suministra datos clave o entropía para datos clave. |
| KEY_FIELD_2 | 128 | 64 | Software suministrado tweak clave o entropía para tweak clave. |

**TSE KEY PROGRAM STRUCT Format**

| Campo | Offset (bytes) | Tamaño (bytes) | Comentarios |
| --- | --- | --- | --- |
| KEYID | 0 | 2 | Identificador clave. |
| KEYID_CTRL | 2 | 4 | Control KeyID: *  Bits 7:0: clave-programming command (COMMAND) *  Bits 23:8: algoritmo de cifrado (ENC ALG) *  Bits 31:24: Reservado, debe ser cero (RSVD) |
| Ignorado | 6 | 58 | No se usa. |
| KEY_FIELD_1 | 64 | 64 | Software suministrado datos clave. |
| KEY_FIELD_2 | 128 | 64 | Software suministrado tweak clave. |

**TSE KEY PROGRAM WRAPPED Control Input**

| Campo | Posiciones de bits | Comentarios |
| --- | --- | --- |
| KEYID | 15:0 | Identificador clave. |
| Reservado | 23:16 | Reservado, debe ser cero. |
| ENC_ALG | 39:24 | Algoritmo de cifrado. |
| Ignorado | 63:40 | No se usa. |

** Formato de estructura de la bicicleta**

| Campo | Offset (bytes) | Tamaño (bytes) | Comentarios |
| --- | --- | --- | --- |
| MAC | 0 | 16 | MAC producido por PBNDKB de su estructura de bind de entrada |
| Reservado | 16 | 8 | Reservado, debe ser cero. |
| IV | 24 | 12 | Vector de inicialización. |
| Reservado | 36 | 28 | Reservado, debe ser cero. |
| BTENCDATA | 64 | 64 | Datos cifrados (datos clave y tweak clave) |
| BTDATA | 128 | 128 | Control adicional y datos (no cifrados) |

## Operación

```text
(* #UD if PCONFIG is not enumerated or CPL > 0 *)
IF CPUID.07H.00H:EDX.PCONFIG[18]= 0 OR CPL > 0

    THEN #UD; FI;

(* #GP(0) for an unsupported leaf function *)
IF EAX > 2

    THEN #GP(0); FI;

CASE (EAX)  (* operation based on selected leaf function *)

0 (MKTME_KEY_PROGRAM):

IF CPUID function 1BH does not enumerate support for the TME-MK target (value 1)

THEN #GP(0); FI;

(* Confirm that TME-MK is properly enabled by the IA32_TME_ACTIVATE MSR *)

(* The MSR must be locked, encryption enabled, and a non-zero number of KeyID bits specified *)

IF IA32_TME_ACTIVATE[0] = 0 OR IA32_TME_ACTIVATE[1] = 0 OR IA32_TME_ACTIVATE[35:32] = 0

            THEN #GP(0); FI;

IF DS:RBX is not 256-byte aligned
      THEN #GP(0); FI;

Load TMP_KEY_PROGRAM_STRUCT from 192 bytes at linear address DS:RBX;

IF TMP_KEY_PROGRAM_STRUCT.KEYID_CTRL sets any reserved bits
      THEN #GP(0); FI;

(* Check for a valid command *)
IF TMP_KEY_PROGRAM_STRUCT. KEYID_CTRL.COMMAND > 3

      THEN #GP(0); FI;

(* Check that the KEYID being operated upon is a valid KEYID *)
IF TMP_KEY_PROGRAM_STRUCT.KEYID = 0 OR

      TMP_KEY_PROGRAM_STRUCT.KEYID > IA32_TME_CAPABILITY.MK_TME_MAX_KEYS
            THEN #GP(0); FI;

k := IA32_TME_ACTIVATE.MK_TME_KEYID_BITS;
IF TMP_KEY_PROGRAM_STRUCT.KEYID[15:k] != 0

      THEN #GP(0); FI;
IF not in SEAM AND IA32_TME_ACTIVATE.TDX_RESERVED_KEYID_BITS > 0

      THEN
            p := IA32_TME_ACTIVATE.TDX_RESERVED_KEYID_BITS;
            IF TMP_KEY_PROGRAM_STRUCT.KEYID[k1:kp] != 0
                  THEN #GP(0); FI;

FI;

(* Check that only one encryption algorithm is requested for the KeyID and it is one of the activated algorithms *)
IF TMP_KEY_PROGRAM_STRUCT.KEYID_CTRL.ENC_ALG does not set exactly one bit OR

      (TMP_KEY_PROGRAM_STRUCT.KEYID_CTRL.ENC_ALG & IA32_TME_ACTIVATE[63:48]) = 0
            THEN #GP(0); FI:

Attempt to acquire lock to gain exclusive access to platform key table for TME-MK;
IF attempt is unsuccessful

      THEN (* PCONFIG failure *)
            RFLAGS.ZF := 1;
            RAX := DEVICE_BUSY; (* failure reason 5 *)


            GOTO EXIT;
FI;

CASE (TMP_KEY_PROGRAM_STRUCT.KEYID_CTRL.COMMAND) OF
      0 (KEYID_SET_KEY_DIRECT):
      Update TME-MK table for TMP_KEY_PROGRAM_STRUCT.KEYID as follows:
            Encrypt with the selected key
            Use the encryption algorithm selected by TMP_KEY_PROGRAM_STRUCT.KEYID_CTRL.ENC_ALG
            (* The number of bytes used by the next two lines depends on selected encryption algorithm *)
            DATA_KEY is TMP_KEY_PROGRAM_STRUCT.KEY_FIELD_1
            TWEAK_KEY is TMP_KEY_PROGRAM_STRUCT.KEY_FIELD_2
      BREAK;

      1 (KEYID_SET_KEY_RANDOM):
      Load TMP_RND_DATA_KEY with a random key using hardware RNG; (* key size depends on selected encryption algorithm *)
      IF there was insufficient entropy

            THEN (* PCONFIG failure *)
                  RFLAGS.ZF := 1;
                  RAX := ENTROPY_ERROR; (* failure reason 2 *)
                  Release lock on platform key table;
                  GOTO EXIT;

      FI;
      Load TMP_RND_TWEAK_KEY with a random key using hardware RNG; (* key size depends on selected encryption algorithm *)
      IF there was insufficient entropy

            THEN (* PCONFIG failure *)
                  RFLAGS.ZF := 1;
                  RAX := ENTROPY_ERROR; (* failure reason 2 *)
                  Release lock on platform key table;
                  GOTO EXIT;

      FI;
      (* Combine software-supplied entropy to the data key and tweak key *)
      (* The number of bytes used by the next two lines depends on selected encryption algorithm *)
      TMP_RND_DATA_KEY := TMP_RND_KEY XOR TMP_KEY_PROGRAM_STRUCT.KEY_FIELD_1;
      TMP_RND_TWEAK_KEY := TMP_RND_TWEAK_KEY XOR TMP_KEY_PROGRAM_STRUCT.KEY_FIELD_2;

      Update TME-MK table for TMP_KEY_PROGRAM_STRUCT.KEYID as follows:
            Encrypt with the selected key
            Use the encryption algorithm selected by TMP_KEY_PROGRAM_STRUCT.KEYID_CTRL.ENC_ALG
            (* The number of bytes used by the next two lines depends on selected encryption algorithm *)
            DATA_KEY is TMP_RND_DATA_KEY
            TWEAK_KEY is TMP_RND_TWEAK_KEY

      BREAK;

      2 (KEYID_CLEAR_KEY):
      Update TME-MK table for TMP_KEY_PROGRAM_STRUCT.KEYID as follows:

            Encrypt (or not) using the current configuration for TME
            The specified encryption algorithm and key values are not used.
      BREAK;

      3 (KEYID_NO_ENCRYPT):
      Update TME-MK table for TMP_KEY_PROGRAM_STRUCT.KEYID as follows:

            Do not encrypt
            The specified encryption algorithm and key values are not used.
      BREAK;


ESAC;
Release lock on platform key table for TME-MK;

1 (TSE_KEY_PROGRAM):
IF CPUID function 1BH does not enumerate support for the TSE target (value 2)

      THEN #GP(0); FI;

IF not in 64-bit mode
      THEN #GP(0); FI;

IF RBX is not 256-byte aligned
      THEN #GP(0); FI;

Load TMP_KEY_STRUCT from 192 bytes at linear address in RBX;

IF TMP_KEY_STRUCT.KEYID_CTRL sets any reserved bits
      THEN #GP(0); FI;

(* Check for a valid command *)
IF TMP_KEY_STRUCT. KEYID_CTRL.COMMAND > 1

      THEN #GP(0); FI;

(* Check that the KEYID being operated upon is a valid KEYID *)
IF TMP_KEY_STRUCT.KEYID > IA32_TSE_CAPABILITY.TSE_MAX_KEYS

      THEN #GP(0); FI;

(* Check that only one encryption algorithm is requested for the KeyID and it is one of the activated algorithms *)
IF TMP_KEY_STRUCT.KEYID_CTRL.ENC_ALG does not set exactly one bit OR

      (TMP_KEY_STRUCT.KEYID_CTRL.ENC_ALG & IA32_TSE_CAPABILITY[15:0]) = 0
            THEN #GP(0); FI;

Attempt to acquire lock to gain exclusive access to platform key table for TSE;
IF attempt is unsuccessful

      THEN (* PCONFIG failure *)
            RFLAGS.ZF := 1;
            RAX := DEVICE_BUSY; (* failure reason 5 *)
            GOTO EXIT;

FI;

CASE (TMP_KEY_STRUCT.KEYID_CTRL.COMMAND) OF
      0 (TSE_SET_KEY_DIRECT):
      Update TSE table for TMP_KEY_STRUCT.KEYID as follows:
            Encrypt with the selected key
            Use the encryption algorithm selected by TMP_KEY_STRUCT.KEYID_CTRL.ENC_ALG
            (* The number of bytes used by the next two lines depends on selected encryption algorithm *)
            DATA_KEY is TMP_KEY_STRUCT.KEY_FIELD_1
            TWEAK_KEY is TMP_KEY_STRUCT.KEY_FIELD_2
      BREAK;

      1 (TSE_NO_ENCRYPT):
      Update TSE table for TMP_KEY_STRUCT.KEYID as follows:

            Do not encrypt
            The specified encryption algorithm and key values are not used.
      BREAK;


ESAC;
Release lock on platform key table for TSE;

2 (TSE_KEY_PROGRAM_WRAPPED):
IF CPUID function 1BH does not enumerate support for the TSE target (value 2)

      THEN #GP(0); FI;

IF not in 64-bit mode OR RBX[23:16] != 0 OR RCX is not 256-byte aligned
      THEN #GP(0); FI;

(* Check that the KEYID being operated upon is a valid KEYID *)
IF RBX[15:0] > IA32_TSE_CAPABILITY.TSE_MAX_KEYS

      THEN #GP(0); FI;

(* Check that only one encryption algorithm is requested for the KeyID and it is one of the activated algorithms *)
IF RBX[39:24] does not set exactly one bit OR (RBX[39:24] & IA32_TSE_CAPABILITY[15:0]) = 0

      THEN #GP(0); FI;

Load TMP_BIND_STRUCT from 256 bytes at linear address in RCX;

(* Check TMP_BIND_STRUCT for illegal values *)
IF bytes 23:16 and bytes 63:36 of TMP_BIND_STRUCT are not all zero

      THEN #GP(0); FI;
IF TMP_BIND_STRUCT.BTDATA.KEY_GENERATION_CTRL > 1

      THEN #GP(0); FI;
IF bytes 128:33 of TMP_BIND_STRUCT.BTDATA are not all zero

      THEN #GP(0); FI;

(* Compute wrapping key *)
PLATFORM_KEY := 256-bit platform-specific key;
WRAPPING_KEY := HMAC_SHA256(PLATFORM_KEY, TMP_BIND_STRUCT.BTDATA.USER_SUPP_CHALLENGE);

(* Compose 176 bytes of additional authenticated data for use by authenticated decryption *)
AAD := Concatenation of bytes 63:16 and bytes 255:128 of TMP_BIND_STRUCT;

DECRYPT_STRUCT := AES256_GCM_DEC(TMP_BIND_STRUCT.BTENCDATA, WRAPPING_KEY, TMP_BIND_STRUCT.IV, AAD, 176);

(* Fail if MAC mismatch *)
IF TMP_BIND_STRUCT.MAC != DECRYPT_STRUCT.MAC

      THEN
            RFLAGS.ZF := 1;
            RAX := UNWRAP_FAILURE; (* failure reason 7 *)
            GOTO EXIT;

FI;

Attempt to acquire lock to gain exclusive access to platform key table for TSE;
IF attempt is unsuccessful

      THEN (* PCONFIG failure *)
            RFLAGS.ZF := 1;
            RAX := DEVICE_BUSY; (* failure reason 5 *)
            GOTO EXIT;

FI;

Update TSE table for RBX[15:0] as follows:


       Encrypt with the selected key
       Use the encryption algorithm selected by RBX[39:24]
       (* The number of bytes used by the next two lines depends on selected encryption algorithm *)
       DATA_KEY is DECRYPT_STRUCT.DEC_DATA.KEY_FIELD_1
       TWEAK_KEY is DECRYPT_STRUCT.DEC_DATA.KEY_FIELD_2

Release lock on platform key table for TSE;

ESAC;

RAX := 0;
RFLAGS.ZF := 0;

EXIT:
RFLAGS.CF := 0;
RFLAGS.PF := 0;
RFLAGS.AF := 0;
RFLAGS.OF := 0;
RFLAGS.SF := 0;
```
