---
summary: 执行 AES 14 回合的解密流程,在 8 块上使用 Key Locker
---

## 说明

AESDECWIDE256KL1指令执行14发AES,使用第二发操作数的句柄表示的256位密钥,解密XMM0-7中的8个区块中的每个区块. 它将XMM0-7中的每个输入区块替换为相应的解密区块,如果操作成功(例如,不会遇到句柄的违反).

## 行动

```text
AESDECWIDE256KL
Handle := UnalignedLoad of 512 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (HandleReservedBitSet (Handle) ||

                      (Handle[0] AND (CPL > 0)) ||
                      Handle [2] ||
                      HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES256);
IF (Illegal Handle) {
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate512 (Handle[511:0], IWKey);
          IF (Authentic == 0)
                THEN RFLAGS.ZF := 1;
                ELSE
                      XMM0 := AES256Decrypt (XMM0, UnwrappedKey) ;
                      XMM1 := AES256Decrypt (XMM1, UnwrappedKey) ;
                      XMM2 := AES256Decrypt (XMM2, UnwrappedKey) ;
                      XMM3 := AES256Decrypt (XMM3, UnwrappedKey) ;
                      XMM4 := AES256Decrypt (XMM4, UnwrappedKey) ;
                      XMM5 := AES256Decrypt (XMM5, UnwrappedKey) ;
                      XMM6 := AES256Decrypt (XMM6, UnwrappedKey) ;
                      XMM7 := AES256Decrypt (XMM7, UnwrappedKey) ;
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
AESDECWIDE256KLunsigned char _mm_aesdecwide256kl_u8(__m128i odata[8], const __m128i idata[8], const void* h);
```
