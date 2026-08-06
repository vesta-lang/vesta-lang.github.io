---
summary: 在主管阴影堆栈托肯中清除忙碌旗
---

## 说明

M64在主管阴影堆栈中清除繁忙的旗子参考. 在标记阴影堆栈后, SSP 被装入值为 0 。

启用 FRED 转换时无法执行此指令 。 FRED 转换不使用主管阴影堆栈符号.

## 行动

```text
IF CR4.CET = 0 OR CR4.FRED = 1

    THEN #UD; FI;

IF IA32_S_CET.SH_STK_EN = 0
    THEN #UD; FI;

IF CPL > 0
    THEN GP(0); FI;

SSP_LA = Linear_Address(mem operand)

IF SSP_LA not aligned to 8 bytes

THEN #GP(0); FI;

expected_token_value = SSP_LA | BUSY_BIT (* busy bit - bit position 0 - must be set *)

new_token_value = SSP_LA              (* Clear the busy bit *)

IF shadow_stack_lock_cmpxchg8b(SSP_LA, new_token_value, expected_token_value) != expected_token_value

invalid_token := 1; FI

(* Set the CF if invalid token was detected *)
RFLAGS.CF = (invalid_token == 1) ? 1 : 0;
RFLAGS.ZF,PF,AF,OF,SF := 0;
SSP := 0
```

## 受影响的旗帜

如果检测到无效的令牌, CF 会被设定, 否则它将被清除 。 ZF、PF、AF、OF和SF被清除。
