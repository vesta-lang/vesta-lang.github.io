---
summary: 标记阴影堆栈忙碌
---

## 说明

SETSSBSY指令在IA32 PL0 SSP MSR的地址上验证一个非繁忙的主管阴影堆栈符号的存在,并标记它繁忙. 在成功执行指令后,SSP设定为IA32 PL0 SSP MSR的值.

启用 FRED 转换时无法执行此指令 。 FRED 转换不使用主管阴影堆栈符号.

## 行动

```text
IF CR4.CET = 0 OR CR4.FRED = 1
    THEN #UD; FI;

IF IA32_S_CET.SH_STK_EN = 0
    THEN #UD; FI;

IF CPL > 0
    THEN GP(0); FI;

SSP_LA = IA32_PL0_SSP
If SSP_LA not aligned to 8 bytes

    THEN #GP(0); FI;

expected_token_value = SSP_LA              (* busy bit must not be set *)

new_token_value  = SSP_LA | BUSY_BIT       (* set busy bit; bit position 0 *)

IF shadow_stack_lock_cmpxchg8B(SSP_LA, new_token_value, expected_token_value) != expected_token_value

THEN #CP(SETSSBSY); FI;

SSP = SSP_LA
```

## 受影响的旗帜

None.

C/C++ 汇编器等效 SETSSBSYvoid setssbsy(void);
