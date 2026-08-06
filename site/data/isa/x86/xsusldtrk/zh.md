---
summary: 悬停跟踪加载地址
---

## 说明

该指令标志着一个Intel TSX(RTM)暂停负载地址跟踪区域的开始. 如果指令在一个交易区域内使用,后续的负载不添加到交易的读集中. 如果在悬浮的负载地址跟踪区域内使用该指令,则会导致交易中止。

如果在交易区域以外使用该指令,则其行为类似NOP。 第16章"与英特尔(R)交易同步扩展程序",在英特尔(R)64和IA-32架构软件开发者手册中,第1卷提供了英特尔(R)TSX悬浮负载地址跟踪的额外信息.

## 行动

```text
XSUSLDTRK
IF RTM_ACTIVE = 1:

    IF SUSLDTRK_ACTIVE = 0:
          SUSLDTRK_ACTIVE := 1

    ELSE:
          RTM_ABORT

ELSE:
    NOP
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XSUSLDTRK void _xsusldtrk(void);
```

## SIMD 浮点 例外

None.

## 其他例外

If CPUID.07H.00H:EDX.TSXLDTRK[16] = 0.

```text
#UD                    If the LOCK prefix is used.
```
