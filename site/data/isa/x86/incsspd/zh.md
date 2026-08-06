---
summary: 增加阴影 栈指针
---

## 说明

此指令可用于通过指令时间的操作数大小来递增当前阴影栈指针,即源操作数中以位数7:0指定的无符号8位值. 指令以 源操作数 的 7: 0 位数执行未签名的 8 位值指定范围内阴影堆栈上的第一个和最后一个元素的弹出和丢弃 。

## 行动

```text
IF CPL = 3
    IF (CR4.CET & IA32_U_CET.SH_STK_EN) = 0
          THEN #UD; FI;

ELSE
    IF (CR4.CET & IA32_S_CET.SH_STK_EN) = 0
          THEN #UD; FI;

FI;

IF (operand size is 64-bit)
    THEN
          Range := R64[7:0];
          shadow_stack_load 8 bytes from SSP;
          IF Range > 0
                THEN shadow_stack_load 8 bytes from SSP + 8 * (Range - 1);
          FI;
          SSP := SSP + Range * 8;
    ELSE
          Range := R32[7:0];
          shadow_stack_load 4 bytes from SSP;
          IF Range > 0
                THEN shadow_stack_load 4 bytes from SSP + 4 * (Range - 1);
          FI;
          SSP := SSP + Range * 4;

FI;
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
INCSSPD void _incsspd(int);
INCSSPQ void _incsspq(int);
```
