---
summary: 执行 AES 的十轮加密流, 8 块上的密钥锁定器
---

## 说明

AESENCWIDE128KL1 指令执行十轮 AES 加密 XMM0-7 八块中的每一个

使用第二个操作数中句柄表示的128位密钥. 它取代 XMM0-7 中的每个输入块

如果操作成功, 则使用其相应的加密块( 例如, 不发生 句柄 违约) 。

## 行动

```text
AESENCWIDE128KL
Handle := UnalignedLoad of 384 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (

                   HandleReservedBitSet (Handle) ||
                   (Handle[0] AND (CPL > 0)) ||
                   Handle [1] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES128
                   );
IF (Illegal Handle)
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate384 (Handle[383:0], IWKey);
          IF Authentic == 0
                THEN RFLAGS.ZF := 1;
                ELSE
                XMM0 := AES128Encrypt (XMM0, UnwrappedKey) ;

                      XMM1 := AES128Encrypt (XMM1, UnwrappedKey) ;
                      XMM2 := AES128Encrypt (XMM2, UnwrappedKey) ;
                      XMM3 := AES128Encrypt (XMM3, UnwrappedKey) ;
                      XMM4 := AES128Encrypt (XMM4, UnwrappedKey) ;
                      XMM5 := AES128Encrypt (XMM5, UnwrappedKey) ;
                      XMM6 := AES128Encrypt (XMM6, UnwrappedKey) ;
                      XMM7 := AES128Encrypt (XMM7, UnwrappedKey) ;
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
AESENCWIDE128KLunsigned char _mm_aesencwide128kl_u8(__m128i odata[8], const __m128i idata[8], const void* h);
```
