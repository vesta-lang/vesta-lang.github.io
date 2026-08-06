---
summary: 使用128比特键执行 AES 的十轮加密流程
---

## 说明

AESENC128KL1指令执行十轮AES,使用128位的密钥 indi-加密第一个操作数.

由第二批操作数的句柄催化. 如果操作成功, 它会存储第一个 操作数 的结果

(例如,不会遇到句柄违规失败).

## 行动

```text
AESENC128KL
Handle := UnalignedLoad of 384 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (

                   HandleReservedBitSet (Handle) ||
                   (Handle[0] AND (CPL > 0)) ||
                   Handle [1] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES128
                   );
IF (Illegal Handle) {
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate384 (Handle[383:0], IWKey);
          IF (Authentic == 0)
          THEN RFLAGS.ZF := 1;
          ELSE
                DEST := AES128Encrypt (DEST, UnwrappedKey) ;
                RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;
```

## 受影响的旗帜

ZF如果操作成功,则设定为0;如果由于句柄的违反,操作失败,则设定为1. 其他算术旗(OF, SF, AF, PF, CF)清除为0.

## Intel C/C++ 内在编译器

```c
AESENC128KL unsigned char _mm_aesenc128kl_u8(__m128i* odata, __m128i idata, const void* h);
```
