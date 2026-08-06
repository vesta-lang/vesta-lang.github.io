---
summary: 读取处理器 ID
---

## 说明

将IA32 TSC AUX MSR(地址C0000103H)的值读入目的地登记册. CS.D和操作数的大小前缀(66H和REX.W)的值不影响RDPID指令的行为.

## 行动

```text
DEST := IA32_TSC_AUX
```

## 受影响的旗帜

None.
