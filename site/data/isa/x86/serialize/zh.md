---
summary: 指令执行序列化
---

## 说明

序列化指令执行 。 在获取和执行下一个指令之前,SERIALIZE指令确保完成之前指令对旗帜,注册簿和内存的所有修改,将所有缓冲写到内存中. 本指令也是英特尔(R)64和IA-32架构软件开发者手册第3A卷第11章中"序列化指令"一节定义的序列化指令.

SERIALIZE不修改注册,算术旗,或内存.

## 行动

```text
Wait_On_Fetch_And_Execution_Of_Next_Instruction_Until(preceding_instructions_complete_and_preceding_stores_globally_visible);
```

## Intel C/C++ 内在编译器

```c
SERIALIZE void _serialize(void);
```

## SIMD 浮点 例外

None.

## 其他例外

如果使用 LOCK 前缀 。

```text
#UD                 If CPUID.07H.00H:EDX.SERIALIZE[14] = 0.
```
