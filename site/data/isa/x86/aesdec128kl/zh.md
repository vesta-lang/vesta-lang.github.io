---
summary: 使用 Key Locker 执行 AES 的十轮解密流程
---

## 说明

AESDEC128KL1指令执行十轮AES,使用句柄从第二轮操作数表示的128位密钥解密第一个操作数. 如果操作成功, 它会存储第一个 操作数 的结果( 例如, 不发生 句柄 违反规则 ) 。

## 行动

```text
AESDEC128KL
Handle := UnalignedLoad of 384 bit (SRC); // Load is not guaranteed to be atomic.
Illegal Handle = (HandleReservedBitSet (Handle) ||

                   (Handle[0] AND (CPL > 0)) ||
                   Handle [2] ||
                   HandleKeyType (Handle) != HANDLE_KEY_TYPE_AES128);
IF (Illegal Handle) {
    THEN RFLAGS.ZF := 1;
    ELSE
          (UnwrappedKey, Authentic) := UnwrapKeyAndAuthenticate384 (Handle[383:0], IWKey);
          IF (Authentic == 0)
                THEN RFLAGS.ZF := 1;
                ELSE

                      DEST := AES128Decrypt (DEST, UnwrappedKey) ;
                      RFLAGS.ZF := 0;
          FI;
FI;
RFLAGS.OF, SF, AF, PF, CF := 0;
```

## 受影响的旗帜

ZF如果操作成功,则设定为0;如果由于句柄的违反,操作失败,则设定为1. 其他算术旗(OF, SF, AF, PF, CF)清除为0.

## Intel C/C++ 内在编译器

```c
AESDEC128KL unsigned char _mm_aesdec128kl_u8(__m128i* odata, __m128i idata, const void* h);
```
