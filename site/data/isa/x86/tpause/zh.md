---
summary: 计时 PAUSE
---

## 说明

TPAUSE指示处理器输入一个依赖执行的优化状态. 有两个这样的优化状态可以选择:轻量级功率/性能优化状态,以及改进的功率/性能优化状态. 两者之间的选择由明确的输入寄存器比特[0] 源操作数规范.

TPAUSE在CPUID.07H.00H:ECX.WAITPKG[5]被列举为1. TPAUSE可以在任何特权级别执行. 此指令的操作在非64位模式和64位模式中是相同的.

与 PAUSE 不同的是, TPAUSE 指令不会在交易区域内部使用时导致中止,该指令在Intel(R)64和IA-32架构软件开发者手册第1卷第16章"与Intel(R) AVX10 的编程"中有所描述.

输入寄存器包含一些信息,如首选的优化状态,处理器应当按下表的描述输入. 保留比特0以外的位数,如果非零,则会产生#GP.

** TPAUSE 输入记录位定义**

| 位值 | 国名 | 醒来时间 | 节省电力 | 其他福利 |
| --- | --- | --- | --- | --- |
| 位 [0] = 0 | C0.2 | 慢一点 | 大一点 | 提高同一核心上其他SMT线程的性能. |
| 位 [0] = 1 | C0.1 | 快点 | 小一点 | N/A |
| 位数 [31:1] | N/A | N/A | N/A | 准备金 |

## 行动

```text
os_deadline := TSC+(IA32_UMWAIT_CONTROL[31:2]<<2)
instr_deadline := UINT64(EDX:EAX)

IF os_deadline < instr_deadline:
    deadline := os_deadline
    using_os_deadline := 1

ELSE:
    deadline := instr_deadline
    using_os_deadline := 0

WHILE TSC < deadline:
    implementation_dependent_optimized_state(Source register, deadline, IA32_UMWAIT_CONTROL[0])

IF using_os_deadline AND TSC  deadline:
    RFLAGS.CF := 1

ELSE:
    RFLAGS.CF := 0

RFLAGS.AF,PF,SF,ZF,OF := 0
```

## Intel C/C++ 内在编译器

```c
TPAUSE uint8_t _tpause(uint32_t control, uint64_t counter);
```

## 数字例外

None.
