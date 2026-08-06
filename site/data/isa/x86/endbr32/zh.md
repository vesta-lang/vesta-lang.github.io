---
summary: 在32位和兼容模式中终止间接分支
---

## 说明

在32位和兼容模式下终止一个间接分支. 此 操作码 是 NOP 当 CET 间接分支跟踪无法启用时, 在不支持 CET 的处理器上.

## 行动

```text
IF EndbranchEnabled(CPL) & (IA32_EFER.LMA = 0 | (IA32_EFER.LMA=1 & CS.L = 0)
    IF CPL = 3
          THEN
                IA32_U_CET.TRACKER = IDLE
                IA32_U_CET.SUPPRESS = 0
          ELSE
                IA32_S_CET.TRACKER = IDLE
                IA32_S_CET.SUPPRESS = 0
    FI;

FI;
```

## 受影响的旗帜

None.

例外 如果使用 LOCK 前缀 。

```text
#UD
```
