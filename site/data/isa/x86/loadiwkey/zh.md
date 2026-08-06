---
summary: 用 Key Locker 装入内部 包装密钥
---

## 说明

LOADIWKEY1指示书写了Key Locker内部的包装密钥,它被称为IWKey. 此 IWKey 被 ENCODEKEY* 指令用于将 密钥 包裹到 句柄 中. 相反,AESENC/DEC*KL指令使用IWKey从句柄中解开这些密钥,并帮助验证句柄的完整性. 出于安全考虑,没有设计指令允许软件直接读取IWKey值.

IWKey包括两个密码密钥以及元数据. 两种密码密钥是从寄存器来源加载的,这样LOADIWKEY就可以执行,而不用密钥永远在记忆中.

密钥输入的操作数是:

* 256位的加密密钥是从两个明显的操作数装入的. * 128位完整性的密钥由隐含的操作数 XMM0装入.

隐含的 操作数 EAX 指定了密钥源,是否允许备份 密钥 :

* EAX[0] 设定时,不允许初始化的包装密钥备份到平台范围

storage.

* EAX [4:1] 此选项指定了密钥源,即密钥的类型. 目前只支持两个编码.

一个0的键源表示,上面描述的密钥输入的操作数应该作为内部的包装密钥直接存储. 键源为1的LOADIWKEY会从带有源注册号(包括XMM0)的芯片随机数生成器XORed中随机数,这样执行LOADIWKEY的软件就不知道实际的IWKey加密和完整性密钥. 软件可以选择将额外的随机数据放入源登记册,以便其他随机数据来源与所提供的硬件随机数生成器结合. 软件在使用1键源执行LOADIWKEY后,总是应该检查ZF,因为由于无法从芯片随机数生成器获得足够的全切数据,此操作可能失败. 0和1的密钥來源都指定使用AES-GCM-SIV算法的IWKey. CPUID.19H:ECX [1] 列举了对键源 1 的支持. 其他所有密钥源编码均保留.

* EAX[31:5]  Reserved.

1. 联合国 关于Key Locker的进一步详情和该指示的使用,请参见:https://software.intel.com/content/www/us/en/develop/download/intel-密钥-locker-profitation.html。

## 行动

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

## 受影响的旗帜

ZF如果操作成功,则设定为0;如果由于RDSEED未收到全通随机数据,操作失败,则设定为1. 其他算术旗(OF, SF, AF, PF, CF)清除为0.

## Intel C/C++ 内在编译器

```c
LOADIWKEY void _mm_loadiwkey(unsigned int ctl, __m128i intkey, __m128i enkey_lo, __m128i enkey_hi);
```
