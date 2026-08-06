---
summary: 平台配置
---

## 说明

PCONFIG指令允许软件配置某些平台特性. 它支持这些具有多个叶函数的特性,使用EAX的值选择一个叶函数.

根据叶的功能,可以使用注册RBX,RCX,和RDX来提供输入信息或用于指令报告输出信息. 地址和操作数是64位模式外的32位,是64位模式外的64位. CS.D的值不影响操作数大小或地址大小.

PCONFIG的执行可能因平台特定原因而失败. 一次执行报告失败,方法是设置ZF旗,并以非零失败原因加载EAX;成功执行清除ZF和EAX.

每个PCONFIG 叶函数适用于一个特定的硬件块,称为PCONFIG目标. 叶 函数只有在处理器支持该目标时才被支持. 每个目标都与数字目标标识符相关联,CPUID 叶 1BH(PCONFIG信息)则列举了所支持目标的标识符. 试图执行一个未定义的叶函数,或者一个适用于一个不支持的目标标识符的叶函数,导致一般保护例外(#GP).

叶 函数 MKTME KEY PROGRAM

PCONFIG 叶函数0(通过加载值为0的EAX选中)用于密钥编程,用于总内存加密-多密钥(TME-MK)1 这个叶函数叫做MKTME KEY PROGRAM,它与TME-MK目标相关,它具有目标标识符1. 叶函数使用EBX(或RBX)寄存器来获取额外的输入信息.

软件使用此叶功能管理与特定密钥标识符(KeyID)相关的加密密钥. 叶函数使用名为TME-MK 密钥编程结构(MKTME KEY PRO-GRAM STRCT)的数据结构. 软件提供EBX(或RBX)中结构的地址(作为DS段的抵消). 该结构的格式见表4-16。

**MKTME KEY PROGRAM Struct格式**

| 外地 | 偏移( 字节) | 大小( 字节) | 评论 |
| --- | --- | --- | --- |
| KEYID | 0 | 2 | 密钥 标识符. |
| KEYID_CTRL | 2 | 4 | 密钥ID 控制 : *  位数 7: 0: 密钥- 编程命令 (COMMAND) *  位数 23: 8: 加密算法( ENC  ALG) *  位数 31: 24: 保留,必须是零(RSVD) |
| 已忽略 | 6 | 58 | 没有使用。 |
| KEY_FIELD_1 | 64 | 64 | 软件提供了数据密钥或Entropy用于数据密钥. |
| KEY_FIELD_2 | 128 | 64 | 软件提供了 tweak 密钥 或 tweak 密钥 的 en. |

**TSE KEY PROGRAM 结构格式**

| 外地 | 偏移( 字节) | 大小( 字节) | 评论 |
| --- | --- | --- | --- |
| KEYID | 0 | 2 | 密钥 标识符. |
| KEYID_CTRL | 2 | 4 | 密钥ID 控制 : *  位数 7: 0: 密钥- 编程命令 (COMMAND) *  位数 23: 8: 加密算法( ENC  ALG) *  位数 31: 24: 保留,必须是零(RSVD) |
| 已忽略 | 6 | 58 | 没有使用。 |
| KEY_FIELD_1 | 64 | 64 | 软件提供了数据密钥. |
| KEY_FIELD_2 | 128 | 64 | 软件提供 tweak 密钥. |

**TSE KEY PROGRAM WRAPPD控制输入**

| 外地 | 位位置 | 评论 |
| --- | --- | --- |
| KEYID | 15:0 | 密钥标识符. |
| 准备金 | 23:16 | 预备,必须是零。 |
| ENC_ALG | 39:24 | 加密算法。 |
| 已忽略 | 63:40 | 没有使用。 |

** 基准结构格式**

| 外地 | 偏移( 字节) | 大小( 字节) | 评论 |
| --- | --- | --- | --- |
| MAC | 0 | 16 | MAC 由它的输入绑定结构的 PBNDKB 生产 |
| 准备金 | 16 | 8 | 预备,必须是零。 |
| IV | 24 | 12 | 初始化向量 。 |
| 准备金 | 36 | 28 | 预备,必须是零。 |
| BTENCDATA | 64 | 64 | 加密数据(数据 密钥 和 tweak 密钥) |
| BTDATA | 128 | 128 | 其他控制和数据(未加密) |

## 行动

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
