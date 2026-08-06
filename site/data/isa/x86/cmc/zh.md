---
summary: 补充 进位标志
---

## 说明

补充 EFLAGS 登记册中的 CF 旗。 CMC操作在非64位模式和64位模式中是相同的.

## 行动

```text
EFLAGS.CF[bit 0] := NOT EFLAGS.CF[bit 0];
```

## 受影响的旗帜

CF旗包含了其原始值的补充. OF, ZF, SF, AF,和PF 旗帜不受影响.
