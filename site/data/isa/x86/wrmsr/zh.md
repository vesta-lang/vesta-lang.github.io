---
summary: 写入模式特定注册
---

## 说明

将注册EDX:EAX的内容写入ECX注册中指定的64位模型特定注册(MSR). (关于支持Intel 64架构的处理器,RCX的高阶32位被忽略. ) EDX寄存器的内容被复制到选定的MSR的高阶32位,EAX寄存器的内容被复制到MSR的低阶32位. (关于支持Intel 64架构的处理器,RAX和RDX各高序的32比特被忽略. ) MSR中未定义或保留的比特应设定为先前读取的值.

此指令必须在特权级别0或实地址模式执行;否则,生成一般保护例外#GP(0). 在 ECX 中指定一个保留或未执行的 MSR 地址,也会引起一般的保护例外. 如果软件试图在保留的MSR中写入比特,处理器也会生成一般保护例外.

当使用 WRMSR 指令写入 MTRR 时, TLBs 无效 。 这包括全球条目(见英特尔(R)64和IA-32架构软件开发者手册第3A卷第5.10.2节"翻译Lookaside Buffers(TLBs)").

MSR的可验证性控制功能,执行追踪,性能监测和机器检查错误. Intel(R)64和IA-32 Architecture Software开发者手册第4卷第2章的"模式-特定注册(MSR)"列出了所有可以使用本指令写成的MSR及其地址. 注意每个处理器家族都有自己的一套MSR. WRMSR指令是一种序列化指令(见Intel(R)64和IA-32架构软件开发者手册第3A卷第9章中的"序列化指令"). 注意WRMSR到IA32 TSC DEADLINE MSR(MSR指数6E0H)和X2APIC MSR(MSR指数802H到83FH)没有序列化.

CPUID指令在使用此指令之前,应当用于确定MSR是否得到支持(CPUID.01H:EDX[5]=1).

## IA-32 架构兼容性

MSR以及使用WRMSR指令读取它们的能力被引入了带有Pentium处理器的IA-32架构. 早于Pentium处理器的IA-32处理器执行此指令,导致操作码例外#UD无效.

## 行动

```text
MSR[ECX] := EDX:EAX;
```

## 受影响的旗帜

None.
