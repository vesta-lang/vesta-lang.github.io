---
summary: 装入 状态标志 输入 AH 登记册
---

## 说明

本指令在兼容模式和遗留模式中执行如上所述. 只有在 CPUID.80000001H: ECX.LAHF_SAHF_64[0] = 1.

## 行动

```text
IF 64-Bit ModeTHENIF CPUID.80000001H:ECX.LAHF_SAHF_64[0] = 1;THEN AH := RFLAGS(SF:ZF:0:AF:0:PF:1:CF);ELSE #UD; FI;ELSEAH
:= EFLAGS(SF:ZF:0:AF:0:PF:1:CF);FI;
```

## 受影响的旗帜

无。 EFLAGS登记册中的旗帜状态不受影响.
