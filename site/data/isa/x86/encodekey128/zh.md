---
summary: 以 Key Locker 编码 128- Bit 密钥
---

## 说明

ENCODEKEY1281指令将一个128位的AES 密钥从隐含的操作数 XMM0包裹成一个密钥 句柄,然后存储在隐含的目标操作数 XMM0-2中.

明确的源操作数具体规定了句柄的限制,如果有的话.

明确 目标操作数 中包含关于 密钥 的来源及其属性的信息. XMM4通过XMM6被保留用于未来的使用,软件不应该依赖它们被零化.

## 行动

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

## 受影响的旗帜

所有算术旗(OF, SF, ZF, AF, PF, CF)清除为0. 虽然它们已获准进行目前定义的行动,但今后的扩展可能会在旗帜中报告信息。

1. 联合国 关于Key Locker的进一步详情和该指令的使用,请参见本文:

https://software.intel.com/content/www/us/en/develop/download/intel-key-locker-specification.html.

2. 国家 SRC[31:3]目前为未来用途预留. SRC[2],表示无解密限制,如果CPUID.19H:EAX[2]为0. SRC[1],表示无加密限制,如果CPUID.19H:EAX[1]为0. SRC[0],表示只有CPL0的限制,如果CPUID.19H:EAX[0]为0.

## Intel C/C++ 内在编译器

```c
ENCODEKEY128 unsigned int _mm_encodekey128_u32(unsigned int htype, __m128i key, void* h);
```
