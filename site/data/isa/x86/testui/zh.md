---
summary: 确定用户中断标记
---

## 行动

```text
CF := UIF;
ZF := AF := OF := PF := SF := 0;
```

## 受影响的旗帜

ZF,OF,AF,PF,SF旗被清除,CF旗的值为用户中断旗.
