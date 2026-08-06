---
summary: 使用 打包单精度浮点值 来集合
---

## 说明

指令从 内存操作数(第二个操作数)指定的内存地址上有条件地加载高达4或8 单精度浮点的值,并使用dword指数. 内存操作数使用SIB字节的VSIB形式来指定一个通用的寄存器操作数作为共同的基数,相对于基数的一系列指数的矢量寄存器和一个恒定的尺度因子.

面具操作数(第三个操作数)指定了每个内存地址的有条件负载操作以及目标操作数(第一个操作数)每个数据元素的相应更新. 条件性由面具寄存器中每个数据元素中最显著的位指定. 如果元素的掩码位没有设置,则目的地寄存器的相应元素保持不变. 目的地寄存器和面具寄存器中数据元素的宽度相同. 整个口罩寄存器将被本指令设定为零,除非该指令导致例外.

使用qword指数,指令有条件地从VSIB地址内存操作数的单精度浮点中加载最多2或4单精度浮点的值,并更新目的地寄存器的下半部. 目的地登记簿的上方128或256位是零字指数。

如果至少有一个元素已经收集(即例外是由除最右侧有其遮罩比特集的元素以外的元素触发),此指令可以被例外中止. 发生这种情况时,目的地登记册和面具操作数被部分更新;那些已经收集到的元素被放置在目的地登记册中,并将他们的面具比特设定为零. 如果任何陷阱或中断从已经收集的元素中待决,它们将被交付来代替例外;在这种情况下,EFLAG.RF被设定为一个,因此在继续指令时,指令断点不会被重新触发.

如果数据大小和索引大小不同,则目的地登记册的一部分和面具登记册的一部分并不对应正在采集的任何元素. 本指令将这些部分设置为零。 即使指令触发了例外,即使指令在收集任何要素之前触发了例外,它也可能对其中一个或两个登记册这样做。

VEX.128 版本 : 对于dword指数,该指令将收集四个单精度浮点值. 对于qword指数,该指令将收集两个值,并将目的地的上64位数零.

VEX.256 版本 : 对于dword指数,该指令将收集8个单精度浮点值. 对于qword指数,该指令将收集四个值,并将目的地的上方128位零.

注意:

* 如果索引、口罩或目的地登记册的任何一对是相同的,则本指令产生UD错误。 * 这些值可以按任何顺序从内存中读取. 内存命令和其他指令 遵循Intel -

64 内存订购模型.

* 过失以右向左的方式交付. 也就是说,如果一个错误是由一个元素引发并交付的,所有

离目的地LSB更近的元素将完成(和无故障). 离MSB更近的单个元素可能完成也可能不完成. 如果某一元素触发多个断层,则按常规顺序交付.

* 要件可以按任何顺序收集,但错误必须按右到左顺序交付;因此,要件必须按下列顺序提交:

在交付过失之前,可以收集过失的左边。 执行该指令可以重复--鉴于相同的输入值和建筑状态,将收集错误的指令左边相同的一组元素。

* 该指示不进行AC检查,因此永远不会造成AC故障。 * 如果地址大小属性为 16- bit, 此指令将会导致 #UD 。 * 如果 内存操作数 编码时没有 SIB 字节,此指令将会导致 #UD 。 * 此指令不应用于访问所绘制的内存 I/ O , 因为它命令了单个负载

执行是具体的,一些执行可能使用大于数据元素大小的负载或加载元素的不确定次数。

* 缩放索引可能比处理器使用的地址比特需要更多的比特表示(例如,32-

bit 模式,如果比例大于一个。 在这种情况下,除了地址位数之外,最重要的位数会被忽略.

## 行动

```text
DEST := SRC1;
BASE_ADDR: base register encoded in VSIB addressing;
VINDEX: the vector index register encoded by VSIB addressing;
SCALE: scale factor encoded by SIB:[7:6];
DISP: optional 1, 4 byte displacement;
MASK := SRC3;

VGATHERDPS (VEX.128 version)
MASK[MAXVL-1:128] := 0;
FOR j := 0 to 3

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 3
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX[i+31:i])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR


DEST[MAXVL-1:128] := 0;

VGATHERQPS (VEX.128 version)
MASK[MAXVL-1:64] := 0;
FOR j := 0 to 3

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 1
    k := j * 64;
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[k+63:k])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:64] := 0;

VGATHERDPS (VEX.256 version)
MASK[MAXVL-1:256] := 0;
FOR j := 0 to 7

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 7
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[i+31:i])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:256] := 0;

VGATHERQPS (VEX.256 version)
MASK[MAXVL-1:128] := 0;
FOR j := 0 to 7

    i := j * 32;
    IF MASK[31+i] THEN

          MASK[i +31:i] := FFFFFFFFH; // extend from most significant bit
    ELSE

          MASK[i +31:i] := 0;
    FI;
ENDFOR
FOR j := 0 to 3


    k := j * 64;
    i := j * 32;
    DATA_ADDR := BASE_ADDR + (SignExtend(VINDEX1[k+63:k])*SCALE + DISP;
    IF MASK[31+i] THEN

          DEST[i +31:i] := FETCH_32BITS(DATA_ADDR); // a fault exits the instruction
    FI;
    MASK[i +31:i] := 0;
ENDFOR
DEST[MAXVL-1:128] := 0;
```

## Intel C/C++ 内在编译器

```c
VGATHERDPS: __m128 _mm_i32gather_ps (float const * base, __m128i index, const int scale);
VGATHERDPS: __m128 _mm_mask_i32gather_ps (__m128 src, float const * base, __m128i index, __m128 mask, const int scale);
VGATHERDPS: __m256 _mm256_i32gather_ps (float const * base, __m256i index, const int scale);
VGATHERDPS: __m256 _mm256_mask_i32gather_ps (__m256 src, float const * base, __m256i index, __m256 mask, const int scale);
VGATHERQPS: __m128 _mm_i64gather_ps (float const * base, __m128i index, const int scale);
VGATHERQPS: __m128 _mm_mask_i64gather_ps (__m128 src, float const * base, __m128i index, __m128 mask, const int scale);
VGATHERQPS: __m128 _mm256_i64gather_ps (float const * base, __m256i index, const int scale);
VGATHERQPS: __m128 _mm256_mask_i64gather_ps (__m128 src, float const * base, __m256i index, __m128 mask, const int scale);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-2-27,"十二类例外条件".
