---
summary: 恢复x87 FPU,MMX,XMM,以及MXCSR状态
---

## 说明

重新装入FPU,MMX技术,XMM,以及MXCSR从源操作数指定的512字节内存图像中注册. 此数据本应是之前使用 FXSAVE 指令,并以与操作模式相同的格式写入存储器. 数据的第一个字节应位于16字节边界上. FXSAVE状态图有三种不同的布局:一种用于遗产和兼容模式,另一种用于64位模式FXSAVE/FXRSTOR与REX.W=0,第三种格式用于64位模式,FXSAVE64/FXRSTOR64. 表3-45显示了内存中遗留/兼容模式状态信息的布局,并描述了FXRSTOR和FXSAVE指令的内存图像中的字段. 表3-48显示了REX.W(FXSAVE64/FXRSTOR64)设定时64位模式状态信息的布局. 表3-49显示了REX.W清晰(FXSAVE/FXRSTOR)时64位模式状态信息的布局.

带有 FXRSTOR 指令的状态图像必须使用 FXSAVE 指令保存,或采用表3-45、表3-48或表3-49所要求的格式。 引用用 FSAVE 、 FNSAVE 指令或不兼容的字段布局保存的状态图像将导致状态恢复不正确。

FXRSTOR指令不冲出待处理的x87 FPU例外. 要检查和提升使用FXRSTOR指令加载x87 FPU状态信息时的例外,在FXRSTOR指令后使用FWAIT指令.

如果控制寄存器中的OSFXSR比特没有设置CR4,则FXRSTOR指令可能无法恢复XMM和MXCSR的寄存器状态. 这种行为取决于执行。

如果 MXCSR 状态包含一个未显示的例外,同时设置了相应的状态旗,那么用 FXRSTOR 指令加载寄存器将不会生成 SIMD 浮点 错误条件. 只有下一次出现这种无假冒的例外,才会产生例外.

MXCSR寄存器的位数16至32被定义为保留,应设定为0. 试图从保存的状态图像中在这些比特中任意写一个1,将导致生成一般的保护例外(#GP).

FXSAVE图像的字节464:511可供软件使用. FXRSTOR忽略了FXSAVE状态图像中字节464:511的内容.

## 行动

```text
IF 64-Bit Mode

    THEN
         (x87 FPU, MMX, XMM15-XMM0, MXCSR) Load(SRC);

    ELSE
          (x87 FPU, MMX, XMM7-XMM0, MXCSR) := Load(SRC);

FI;

x87 FPU and SIMD Floating-Point Exceptions
None.
```
