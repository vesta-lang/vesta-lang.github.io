---
summary: 交换GS基地登记册
---

## 说明

SWAPGS与IA32 KERNEL GS BASE MSR(MSR地址C0000102H)交换当前的GS基注册值. SWAPGS指令是一种特权指令,意在被系统软件使用.

在使用SYSCALL执行系统调用时,OS入口处没有内核堆栈. 也没有一种直截了当的方法来获取内核结构的指针,从中可以读取内核栈指针. 因此,内核无法保存通用的登记器或参考存储器.

根据设计,SWAPGS不需要任何通用注册或内存操作数. 使用指示前不需要保存任何登记册 。 SWAPGS从IA32 KERNEL GS BASE MSR交换CPL 0数据指针,并使用GS基号注册. 然后内核可以在正常内存引用上使用GS前缀来访问内核数据结构. 同样,当OS内核使用中断或例外(内核堆栈已经设置的地方)输入时,SWAPGS可以用来快速获得内核数据结构的指针.

IA32 KERNEL GS BASE MSR本身只能使用RDMSR/WRMSR指令访问. 这些指示只能在0级特权级别上获得。 WRMSR指令确保IA32 KERNEL GS BASE MSR包含一个犬类地址.

启用 FRED 转换时无法执行指令 。 FRED过渡在更改CPL时进行相同的互换.

## 行动

```text
IF CS.L  1 (* Not in 64-Bit Mode *) OR CR4.FRED = 1

    THEN
          #UD; FI;

IF CPL  0

    THEN #GP(0); FI;

tmp := GS.base;
GS.base := IA32_KERNEL_GS_BASE;
IA32_KERNEL_GS_BASE := tmp;
```

## 受影响的旗帜

None.
