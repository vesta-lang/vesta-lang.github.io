---
summary: 读取随机数字
---

## 说明

装入生成随机值的硬件并将其存储在目标寄存器中。 随机值的大小由目的地注册大小和操作模式决定. 进位标志表示在执行指令时是否有随机值. CF=1表示目的地的数据有效. 否则CF=0,目标操作数中的数据将作为指定宽度的零返回. 在这两种情况下,所有其他旗帜都被迫为0。 软件必须检查CF=1的状态,以确定是否返回了有效的随机值,否则预计将循环和重试执行RDRAND(见Intel(R)64和IA-32架构软件开发者手册,第一卷,7.3.17节,"随机数生成者指令").

该课程可在各个特权级别提供。

在64位模式中,指令默认的操作数大小为32位. 使用REX的前缀形式为REX.B,允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位操作数. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
IF HW_RND_GEN.ready = 1
    THEN
          CASE of
                operand size is 64: DEST[63:0] := HW_RND_GEN.data;
                operand size is 32: DEST[31:0] := HW_RND_GEN.data;
                operand size is 16: DEST[15:0] := HW_RND_GEN.data;
          ESAC
          CF := 1;
    ELSE
          CASE of
                operand size is 64: DEST[63:0] := 0;
                operand size is 32: DEST[31:0] := 0;
                operand size is 16: DEST[15:0] := 0;
          ESAC
          CF := 0;

FI
OF, SF, ZF, AF, PF := 0;
```

## 受影响的旗帜

CF旗根据结果设置(见上文"行动"部分). OF,SF,ZF,AF,和PF的旗帜被设定为0.

## Intel C/C++ 内在编译器

```c
RDRAND int _rdrand16_step( unsigned short * );
RDRAND int _rdrand32_step( unsigned int * );
RDRAND int _rdrand64_step( unsigned __int64 *);
```
