---
summary: 写入阴影堆栈
---

## 说明

在寄存器来源中将字节写入阴影堆栈 。

## 行动

```text
IF CPL = 3
    IF (CR4.CET & IA32_U_CET.SH_STK_EN) = 0
          THEN #UD; FI;
    IF (IA32_U_CET.WR_SHSTK_EN) = 0
          THEN #UD; FI;

ELSE
    IF (CR4.CET & IA32_S_CET.SH_STK_EN) = 0
          THEN #UD; FI;
    IF (IA32_S_CET.WR_SHSTK_EN) = 0
          THEN #UD; FI;

FI;
DEST_LA = Linear_Address(mem operand)
IF (operand size is 64 bit)

    THEN
          (* Destination not 8B aligned *)
          IF DEST_LA[2:0]
                THEN GP(0); FI;
          Shadow_stack_store 8 bytes of SRC to DEST_LA;

    ELSE
          (* Destination not 4B aligned *)
          IF DEST_LA[1:0]
                THEN GP(0); FI;
          Shadow_stack_store 4 bytes of SRC[31:0] to DEST_LA;

FI;
```

## 受影响的旗帜

None.

C/C++ 编译器等效

WRSSD 无效  wrssd(  int32,无效 *); WRSSQ 无效   wrssq(  int64,无效 *);
