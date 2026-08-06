---
summary: 包装的 单精度浮点 添加/减法
---

## 说明

添加 第一源操作数(第二操作数)的奇数单精度浮点值,加上第二源操作数(第三操作数)的相应单精度浮点值;存储结果为目标操作数(第一操作数)的奇数值. 将 第二源操作数 的偶数单精度浮点 值从 第一源操作数 中对应的单精度浮值中减去;将结果存储到 目标操作数 的偶数值中.

在64位模式中,使用REX前缀的形式为REX.R,允许此指令访问额外的注册(XMM8-XMM15).

128位遗产 SSE 版本 : 第二个来源可以是XMM寄存器或128位的内存位置. 目的地与第一个来源的XMM注册点没有区别,对应的MAXVL-1:128注册点的上位点(YMM注册点)没有修改. 见图3-4。

VEX.128编码版本:第一源操作数是一个XMM的寄存器或128位内存位置. 目标操作数是一个XMM登记册. 对应的YMM注册目的地被清零的上位(MAXVL-1:128).

VEX.256 编码版本 : 第一源操作数是一个YMM登记册. 第二源操作数可以是YMM的寄存器,也可以是256位的内存位置. 目标操作数是一个YMM登记册.

ADDSUBPS xmm1, xmm2/m128

[127:96]           [95:64]                                     [63:32]           [31:0]        xmm2/ m128

xmm1[127:96] + xmm1[95:64] - xmm2/ xmm1[63:32] +                                 xmm1[31:0] -  RESULT:

xmm2/m128[127:96]  m128[95:64]                                 xmm2/m128[63:32]  xmm2/m128[31:0] xmm1

[127:96]           [95:64]                                     [63:32]           [31:0]

OM15992

图3-4。 ADDSUBPS - 装入的 单精度浮点 添加/分录

## 行动

```text
ADDSUBPS (128-bit Legacy SSE Version)
DEST[31:0] := DEST[31:0] - SRC[31:0]
DEST[63:32] := DEST[63:32] + SRC[63:32]
DEST[95:64] := DEST[95:64] - SRC[95:64]
DEST[127:96] := DEST[127:96] + SRC[127:96]
DEST[MAXVL-1:128] (Unmodified)

VADDSUBPS (VEX.128 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] + SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] + SRC2[127:96]
DEST[MAXVL-1:128] := 0

VADDSUBPS (VEX.256 Encoded Version)
DEST[31:0] := SRC1[31:0] - SRC2[31:0]
DEST[63:32] := SRC1[63:32] + SRC2[63:32]
DEST[95:64] := SRC1[95:64] - SRC2[95:64]
DEST[127:96] := SRC1[127:96] + SRC2[127:96]
DEST[159:128] := SRC1[159:128] - SRC2[159:128]
DEST[191:160] := SRC1[191:160] + SRC2[191:160]
DEST[223:192] := SRC1[223:192] - SRC2[223:192]
DEST[255:224] := SRC1[255:224] + SRC2[255:224]
```

## Intel C/C++ 内在编译器

```c
ADDSUBPS __m128 _mm_addsub_ps(__m128 a, __m128 b) VADDSUBPS __m256 _mm256_addsub_ps (__m256 a, __m256 b) Exceptions When the source operand is a memory operand, the operand must be aligned on a 16-byte boundary or a general- protection exception (#GP) will be generated.;
```

## SIMD 浮点 例外

Overflow, Underflow, Invalid, Precision, Denormal.

## 其他例外

参见表2-19"第2类例外条件".

ADOX - 无符号的整数添加两个带有过流旗的操作数

操作码/ Op64/32bit CPUID 描述指令

```text
                      En Mode           Feature
```

支持旗帜

F3 0F 38 F6/r RM V/VADX未签名的添加r32与其中,r/m32改为:r32,写着。 ADOX r32, r/m32

F3 REX.w 0F 38 F6 /r RM V/N.E.         ADX 未签名添加 r64 与 OF, r/m64 到 r64,写作 OF. ADOX r64, r/m64

## 说明

执行目标操作数(第一操作数),源操作数(第二操作数)和溢流旗(OF)的未签名添加,并将结果存储在目标操作数中. 目标操作数是一个通用寄存器,而源操作数可以是通用寄存器或内存位置. 状况代表了以前增加的内容。 指令将OF旗与操作数未签名的加载产生的载荷设定在一起.

ADOX指令是在多精度添加的背景下执行的,我们在这里添加了一系列带有载链的操作数. 在添加链的开头,我们执行一个指令到0 OF(例如. XOR) (英语).

此指令以真实模式和 虚拟 8086 模式 支持 。 操作数大小如果不是64位模式,总是32位.

在64位模式下,默认操作大小为32位. 使用REX的前缀形式为REX.R,允许访问额外的登记册(R8-15). 使用REX 前缀的形式为REX.W,促进运行到64位.

ADOX通常在一个交易区域内外执行. 说明: ADOX对CF和OF旗的定义不同于Intel(R)64和IA-32架构软件开发者手册第2A卷中定义的ADD/ADC指令.

## 行动

```text
IF OperandSize is 64-bit

    THEN OF:DEST[63:0] := DEST[63:0] + SRC[63:0] + OF;
    ELSE OF:DEST[31:0] := DEST[31:0] + SRC[31:0] + OF;
FI;
```

## 受影响的旗帜

OF根据结果更新。 CF,SF,ZF,AF,和PF旗没有修改.

## Intel C/C++ 内在编译器

```c
unsigned char _addcarryx_u32 (unsigned char c_in, unsigned int src1, unsigned int src2, unsigned int *sum_out);
unsigned char _addcarryx_u64 (unsigned char c_in, unsigned __int64 src1, unsigned __int64 src2, unsigned __int64 *sum_out);
```

## SIMD 浮点 例外

None.

ADOX - 无符号的整数添加两个带有过流旗的操作数
