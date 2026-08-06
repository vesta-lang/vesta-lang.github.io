---
summary: 读取随机 SEED
---

## 说明

装入生成随机值的硬件并将其存储在目标寄存器中。 随机值由NRBG(非定型随机位生成器)生成,它与NIST,SP800-90B和NIST,SP800-90C在XOR构建模式中兼容. 随机值的大小由目的地注册大小和操作模式决定. 进位标志表示在执行指令时是否有随机值. CF=1表示目的地的数据有效. 否则CF=0,目标操作数中的数据将作为指定宽度的零返回. 在这两种情况下,所有其他旗帜都被迫为0。 软件必须检查CF=1的状态,以确定是否返回了有效的随机种子值,否则预计将循环和重试RDSEED的执行(见第1.2节).

RDSEED 指令在所有特权级别都有。 RDSEED 指令通常在一个交易区域内外执行。

在64位模式中,指令默认的操作数大小为32位. 使用REX的前缀形式为REX.B,允许访问额外的注册(R8-R15). 使用REX前缀,形式为REX.W,促进运行到64位操作数. 参见本节开头的汇总图,用于编码数据和限制.

## 行动

```text
IF HW_NRND_GEN.ready = 1
    THEN
          CASE of
                operand size is 64: DEST[63:0] := HW_NRND_GEN.data;
                operand size is 32: DEST[31:0] := HW_NRND_GEN.data;
                operand size is 16: DEST[15:0] := HW_NRND_GEN.data;
          ESAC;
          CF := 1;
    ELSE
          CASE of
                operand size is 64: DEST[63:0] := 0;
                operand size is 32: DEST[31:0] := 0;
                operand size is 16: DEST[15:0] := 0;
          ESAC;
          CF := 0;

FI;

OF, SF, ZF, AF, PF := 0;
```

## 受影响的旗帜

CF旗根据结果设置(见上文"行动"部分). OF,SF,ZF,AF,和PF的旗帜被设定为0.

C/C++ 编译器等效

RDSEED 英寸  rdseed16  step( 未签名的简称) * * ; RDSEED 英寸 rdseed32 step(未签名英寸) * * ; RDSEED int  rdseed64 step(未署名 int64*);
