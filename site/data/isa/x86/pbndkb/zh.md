---
summary: 平台 Bind 密钥 到 二进制大对象
---

## 说明

PBNDKB指令允许软件通过加密一个平台专用的包装密钥来将信息绑定到一个平台. 加密数据日后可能被PCONFIG指令用于配置总存储加密(TSE)引擎.

指令只能以64位模式执行. RBX和RCX登记册为指令提供输入信息。 PBNDKB的执行可能因平台特定原因而失败. 一次执行报告失败,方法是设置ZF旗,并以非零失败原因加载EAX;成功执行清除ZF和EAX.

该指令在称为绑定结构的256字节数据结构上运行. 它在RBX的线性地址上读取绑定结构,并将修改后的绑定结构写到RCX的线性地址上. RBX和RCX的地址必须彼此不同,并必须是256字节对齐.

指令加密部分输入绑定结构,并生成该结构部分的MAC. 加密数据和MAC作为输出绑定结构的一部分被写入.

捆绑结构的格式见表4-13.

** 基准结构格式**

| 外地 | 偏移( 字节) | 大小( 字节) | 评论 |
| --- | --- | --- | --- |
| MAC | 0 | 16 | PBNDKB 根据输入绑定结构输出为 MAC |
| 准备金 | 16 | 8 | 保留;输入时必须是0,输出为0 |
| IV | 24 | 12 | PBNDKB 生成并输出初始化矢量 |
| 准备金 | 36 | 28 | 保留;输入时必须是0,输出为0 |
| BTENCDATA | 64 | 64 | 加密数据(输入说明;输出说明) |
| BTDATA | 128 | 128 | 其他控制和数据(已修改但未加密) |

## 行动

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
