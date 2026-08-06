---
summary: Platform Configuration
---

## Description

The PCONFIG instruction allows software to configure certain platform features. It supports these features with multiple leaf functions, selecting a leaf function using the value in EAX.

Depending on the leaf function, the registers RBX, RCX, and RDX may be used to provide input information or for the instruction to report output information. Addresses and operands are 32 bits outside 64-bit mode and are 64 bits in 64-bit mode. The value of CS.D does not affect operand size or address size.

Executions of PCONFIG may fail for platform-specific reasons. An execution reports failure by setting the ZF flag and loading EAX with a non-zero failure reason; a successful execution clears ZF and EAX.

Each PCONFIG leaf function applies to a specific hardware block called a PCONFIG target. The leaf function is supported only if the processor supports that target. Each target is associated with a numerical target identifier, and CPUID leaf 1BH (PCONFIG information) enumerates the identifiers of the supported targets. An attempt to execute an undefined leaf function, or a leaf function that applies to an unsupported target identifier, results in a general-protection exception (#GP).

Leaf Function MKTME_KEY_PROGRAM

PCONFIG leaf function 0 (selected by loading EAX with value 0) is used for key programming for total memory encryption-multi-key (TME-MK).1 This leaf function is called MKTME_KEY_PROGRAM and it pertains to the TME-MK target, which has target identifier 1. The leaf function uses the EBX (or RBX) register for additional input information.

Software uses this leaf function to manage the encryption key associated with a particular key identifier (KeyID). The leaf function uses a data structure called the TME-MK key programming structure (MKTME_KEY_PRO- GRAM_STRUCT). Software provides the address of the structure (as an offset in the DS segment) in EBX (or RBX). The format of the structure is given in Table 4-16.

**MKTME_KEY_PROGRAM_STRUCT Format**

| Field | Offset (bytes) | Size (bytes) | Comments |
| --- | --- | --- | --- |
| KEYID | 0 | 2 | Key Identifier. |
| KEYID_CTRL | 2 | 4 | KeyID control: *  Bits 7:0: key-programming command (COMMAND) *  Bits 23:8: encryption algorithm (ENC_ALG) *  Bits 31:24: Reserved, must be zero (RSVD) |
| Ignored | 6 | 58 | Not used. |
| KEY_FIELD_1 | 64 | 64 | Software supplied data key or entropy for data key. |
| KEY_FIELD_2 | 128 | 64 | Software supplied tweak key or entropy for tweak key. |

**TSE_KEY_PROGRAM_STRUCT Format**

| Field | Offset (bytes) | Size (bytes) | Comments |
| --- | --- | --- | --- |
| KEYID | 0 | 2 | Key Identifier. |
| KEYID_CTRL | 2 | 4 | KeyID control: *  Bits 7:0: key-programming command (COMMAND) *  Bits 23:8: encryption algorithm (ENC_ALG) *  Bits 31:24: Reserved, must be zero (RSVD) |
| Ignored | 6 | 58 | Not used. |
| KEY_FIELD_1 | 64 | 64 | Software supplied data key. |
| KEY_FIELD_2 | 128 | 64 | Software supplied tweak key. |

**TSE_KEY_PROGRAM_WRAPPED Control Input**

| Field | Bit Positions | Comments |
| --- | --- | --- |
| KEYID | 15:0 | Key identifier. |
| Reserved | 23:16 | Reserved, must be zero. |
| ENC_ALG | 39:24 | Encryption algorithm. |
| Ignored | 63:40 | Not used. |

**Bind Structure Format**

| Field | Offset (bytes) | Size (bytes) | Comments |
| --- | --- | --- | --- |
| MAC | 0 | 16 | MAC produced by PBNDKB of its input bind structure |
| Reserved | 16 | 8 | Reserved, must be zero. |
| IV | 24 | 12 | Initialization vector. |
| Reserved | 36 | 28 | Reserved, must be zero. |
| BTENCDATA | 64 | 64 | Encrypted data (data key and tweak key) |
| BTDATA | 128 | 128 | Additional control and data (not encrypted) |

## Operation

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
