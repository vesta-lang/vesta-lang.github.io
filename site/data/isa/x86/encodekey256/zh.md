---
summary: 用 Key Locker 编码 256- Bit 密钥
---

## 说明

ENCODEKEY2561指令从隐含的操作符XMM1:XMM0将256位的AES密钥包成密钥柄,然后存储在隐含的目的地操作符XMM0-3中.

明晰的源操作数是一个通用寄存器,并指定句柄的限制应该包含在句柄中.

明确 目标操作数 中包含关于 密钥 的来源及其属性的信息. XMM4通过XMM6被保留用于未来的使用,软件不应该依赖它们被零化.

## 行动

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

## 受影响的旗帜

所有算术旗(OF, SF, ZF, AF, PF, CF)清除为0. 虽然它们已获准进行目前定义的行动,但今后的扩展可能会在旗帜中报告信息。

## Intel C/C++ 内在编译器

```c
ENCODEKEY256 unsigned int _mm_encodekey256_u32(unsigned int htype, __m128i key_lo, __m128i key_hi, void* h);
```
