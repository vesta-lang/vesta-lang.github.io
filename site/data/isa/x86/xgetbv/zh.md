---
summary: 获取扩展 控制寄存器 的值
---

## 说明

将ECX登记簿中指定的扩展的控制寄存器(XCR)的内容读入登记簿EDX:EAX. (关于支持英特尔64架构的处理器,RCX的高阶32位被忽略. ) EDX寄存器装入了XCR的高阶32位,EAX寄存器装入了低阶32位. (关于支持Intel 64架构的处理器,RAX和RDX的每个高序32位被清除. ) 如果在正在读取的XCR中执行的比特不到64位,那么返回到EDX:EAX中未执行的比特位置的数值是未定义的.

XCR0在任何支持XGETBV指令的处理器上都得到支持. 如果 CPUID.0DH.01H:EAX.XGETBV1[2] = 1,则执行 XGETBV 与 ECX = 1 返回 EDX:EAX 逻辑-AND的XCR0 和 XINUSE 状态组件位图的当前值. 这允许软件发现XSAVEOPT和XSAVES使用的init优化状态. 参见第13章"管理状态使用XSAVE Feature Set",Intel(R)64和IA-32架构软件开发者手册第1卷.

对ECX使用其他任何值都会导致一般保护(#GP)例外.

## 行动

```text
EDX:EAX := XCR[ECX];
```

## 受影响的旗帜

None.

## Intel C/C++ 内在编译器

```c
XGETBV unsigned __int64 _xgetbv( unsigned int);
```
