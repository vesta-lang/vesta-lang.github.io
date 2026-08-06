---
summary: 存储 AH 输入旗帜
---

## 说明

装入 EFLAGS 寄存器的 SF, ZF, AF, PF, 和 CF 旗, 其值来自 AH 寄存器中的相应位数(分别为位数 7, 6, 4, 2和 0). 注册号AH的位数1,3和5被忽略;EFLAGS注册号中相应的保留位数(1,3和5)仍然如下文"操作"部分所示.

本指令在兼容模式和遗留模式中执行如上所述. 只有在 CPUID.80000001H: ECX.LAHF_SAHF_64[0] = 1.

## 行动

```text
IF IA-64 Mode
    THEN
          IF CPUID.80000001H:ECX[0] = 1;
                THEN
                      RFLAGS(SF:ZF:0:AF:0:PF:1:CF) := AH;
                ELSE
                      #UD;
          FI
    ELSE
          EFLAGS(SF:ZF:0:AF:0:PF:1:CF) := AH;

FI;
```

## 受影响的旗帜

SF,ZF,AF,PF,和CF旗都从AH登记册中加载值. EFLAGS 寄存器中的位数1,3和5不受影响,其值分别剩余1,0和0.
