---
summary: 读取阴影 栈指针
---

## 说明

复制当前阴影 栈指针 (SSP) 注册到注册目的地 。 此 操作码 是 NOP 当 CET 阴影堆栈无法启用时, 以及在不支持 CET 的处理器上.

## 行动

```text
IF CPL = 3
    IF CR4.CET & IA32_U_CET.SH_STK_EN
          IF (operand size is 64 bit)
                THEN
                      Dest := SSP;
                ELSE
                      Dest := SSP[31:0];
          FI;
    FI;

ELSE
    IF CR4.CET & IA32_S_CET.SH_STK_EN
          IF (operand size is 64 bit)
                THEN
                      Dest := SSP;
                ELSE
                      Dest := SSP[31:0];
          FI;
    FI;

FI;
```

## 受影响的旗帜

None.

C/C++ 编译器等效

RDSSPD__int32 _rdsspd_i32(void); RDSSPQ__int64 _rdsspq_i64(void);
