---
summary: 执行 AES 的十轮解密, 8 块上的密钥锁定器
---

## 说明

AESDECWIDE128KL1指令执行十轮AES,使用句柄从第二轮操作数表示的128位密钥,解密XMM0-7中的8个区块中的每个区块. 它将XMM0-7中的每个输入区块替换为相应的解密区块,如果操作成功(例如,不会遇到句柄的违反).

## 行动

```text
AESDECWIDE128KL
Handle := UnalignedLoad of 384 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (HandleReservedBitSet (Handle) ||

                   (Handle[0] AND (CPL > 0)) ||
                   Handle [2] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES128);
IF (Illegal Handle)
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate384 (Handle[383:0], IWKey);
          IF Authentic == 0 {
                THEN RFLAGS.ZF := 1;
                ELSE

                      XMM0 := AES128Decrypt (XMM0, UnwrappedKey) ;
                      XMM1 := AES128Decrypt (XMM1, UnwrappedKey) ;
                      XMM2 := AES128Decrypt (XMM2, UnwrappedKey) ;
                      XMM3 := AES128Decrypt (XMM3, UnwrappedKey) ;
                      XMM4 := AES128Decrypt (XMM4, UnwrappedKey) ;
                      XMM5 := AES128Decrypt (XMM5, UnwrappedKey) ;
                      XMM6 := AES128Decrypt (XMM6, UnwrappedKey) ;
                      XMM7 := AES128Decrypt (XMM7, UnwrappedKey) ;
                      RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;
```

## 受影响的旗帜

ZF如果操作成功,则设定为0;如果由于句柄的违反,操作失败,则设定为1. 其他算术旗(OF, SF, AF, PF, CF)清除为0.

1. 联合国 关于Key Locker的进一步详情和该指示的使用,请参见:https://software.intel.com/content/www/us/en/develop/download/intel-密钥-locker-profitation.html。

## Intel C/C++ 内在编译器

```c
AESDECWIDE128KLunsigned char _mm_aesdecwide128kl_u8(__m128i odata[8], const __m128i idata[8], const void* h);
```
