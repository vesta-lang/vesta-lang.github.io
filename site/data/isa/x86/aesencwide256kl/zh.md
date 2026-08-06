---
summary: 执行 AES 的 14 轮加密流, 在 8 块上使用 Key Locker
---

## 说明

AESENCWIDE256KL1指令执行14发AES,以加密XMM0-7中的8个区块中的每个区块

使用第二个操作数的句柄表示的256位密钥. 它取代 XMM0-7 中的每个输入块

如果操作成功, 则使用其相应的加密块( 例如, 不发生 句柄 违约) 。

## 行动

```text
AESENCWIDE256KL
Handle := UnalignedLoad of 512 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (

                   HandleReservedBitSet (Handle) ||
                   (Handle[0] AND (CPL > 0)) ||
                   Handle [1] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES256
                   );
IF (Illegal Handle)
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate512 (Handle[511:0], IWKey);
          IF (Authentic == 0)
                THEN RFLAGS.ZF := 1;
                ELSE

                      XMM0 := AES256Encrypt (XMM0, UnwrappedKey) ;
                      XMM1 := AES256Encrypt (XMM1, UnwrappedKey) ;
                      XMM2 := AES256Encrypt (XMM2, UnwrappedKey) ;
                      XMM3 := AES256Encrypt (XMM3, UnwrappedKey) ;
                      XMM4 := AES256Encrypt (XMM4, UnwrappedKey) ;
                      XMM5 := AES256Encrypt (XMM5, UnwrappedKey) ;
                      XMM6 := AES256Encrypt (XMM6, UnwrappedKey) ;
                      XMM7 := AES256Encrypt (XMM7, UnwrappedKey) ;
                      RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;

1. Further details on Key Locker and usage of this instruction can be found here:
     https://software.intel.com/content/www/us/en/develop/download/intel-key-locker-specification.html.
```

## 受影响的旗帜

ZF如果操作成功,则设定为0;如果由于句柄的违反,操作失败,则设定为1. 其他算术旗(OF, SF, AF, PF, CF)清除为0.

## Intel C/C++ 内在编译器

```c
AESENCWIDE256KLunsigned char _mm_aesencwide256kl_u8(__m128i odata[8], const __m128i idata[8], const void* h);
```
