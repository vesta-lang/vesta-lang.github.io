---
summary: 历史重置
---

## 说明

请处理器选择性地重置当前逻辑处理器所维护的硬件历史中选定的组件. HRESET操作由隐含的EAX 操作数控制. 明文 imm8 操作数的值被忽略. 此指令只能在特权级别 0 执行 。

HRESET指令可用于请求重置硬件历史的多个组件. 在HRESET执行前,系统软件必须采取以下步骤: 1.

1. 联合国 通过CPUID.20H.00H:EBX来假设HRESET的能力,这表示硬件历史中哪些组件可以重置.

2. 国家 只有CPUID.20H.00H:EBX所列举的比特可以设置在IA32 HRESET ENULE MSR中.

HRESET如果EAX设置了IA32 HRESET EN-ABLE MSR中未设置的任何位点,则会导致一般保护例外(#GP).

在交易区域中执行 HRESET 指令的任何尝试都会导致交易中止 。

## 行动

```text
IF EAX = 0

  THEN NOP
  ELSE

      FOREACH i such that EAX[i] = 1
         Reset prediction history for feature i

FI
```

## 受影响的旗帜

None.
