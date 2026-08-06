---
summary: 组合包装的字, 带有签名的字索引的包装字
---

## 说明

集合了由BASE APDR和带有SCALE尺度的索引矢量VINDEX指向的8个双字/quadword内存位置. 结果被写入矢量寄存器中. 元素通过VSIB指定(即索引寄存器是矢量寄存器,持有打包指数). 元素只有在相应的掩码位为一时才会被加载. 如果元素的掩码位没有设置,则目的地寄存器的相应元素保持不变. 整个口罩寄存器将被本指令设定为零,除非它触发例外.

如果至少有一个元素已经收集(即例外是由除最右侧有其遮罩比特集的元素以外的元素触发),此指令可以被例外中止. 发生这种情况时,目的地注册和面具注册(k1)会部分更新;那些已经收集到的元素会被放入目的地注册,并将他们的面具比特设定为零. 如果任何陷阱或中断从已经收集的元素中待决,它们将被交付来代替例外;在这种情况下,EFLAG.RF被设定为一个,因此在继续指令时,指令断点不会被重新触发.

如果数据元素大小小于索引元素大小,则目标寄存器和掩码寄存器的较高部分与正在采集的任何元素不对应. 本指令将较高部分设置为零。 它可以将这些未使用元素更新到其中一个或两个登记册,即使该指令触发了例外,即使该指令在收集任何元素之前触发了例外。

注意:

* 这些值可以按任何顺序从内存中读取. 内存命令和其他指令 遵循Intel -

64 内存订购模型.

* 过失以右向左的方式交付. 也就是说,如果一个错误是由一个元素引发并交付的,所有

离目的地zmm的LSB更近的元素将完成(和不故障). 离MSB更近的单个元素可能完成也可能不完成. 如果某一元素触发多个断层,则按常规顺序交付.

* 要件可以按任何顺序收集,但错误必须按右到左顺序交付;因此,要件必须按下列顺序提交:

在交付过失之前,可以收集过失的左边。 执行该指令可以重复--鉴于相同的输入值和建筑状态,将收集错误的指令左边相同的一组元素。

* 该指示不进行AC检查,因此永远不会造成AC故障。 * 16位有效地址无效 。 将带来#UD的过失. * 由于 k1 中的 0 值是用来确定完成的,所以这些指令不接受零擦拭。

注意VSIB字节的存在在本指令中执行. 因此,如果 ModRM.rm 与 100b 不同, 指令将会有 #UD 错误 。

本指令有与标量指令(Tuple 1)相同的Disp8*N和对齐规则.

如果目的地矢量zmm1与指数矢量VINDEX相同,则指令会#UD断层. 如果指定 k0 口罩寄存器, 指令会显示 #UD 错误 。

缩放索引可能比处理器使用的地址比特需要更多的比特表示(例如,在32位模式下,如果比特大于一个). 在这种情况下,除了地址位数之外,最重要的位数会被忽略.

## 行动

```text
BASE_ADDR stands for the memory operand base address (a GPR); may not exist
VINDEX stands for the memory operand vector of indices (a ZMM register)
SCALE stands for the memory operand scalar (1, 2, 4 or 8)
DISP is the optional 1 or 4 byte displacement

VPGATHERQD (EVEX encoded version)

(KL, VL) = (2, 128), (4, 256), (8, 512)

FOR j := 0 TO KL-1

i := j * 32

k := j * 64

IF k1[j]

     THEN DEST[i+31:i] := MEM[BASE_ADDR + (VINDEX[k+63:k]) * SCALE + DISP]

             k1[j] := 0

     ELSE *DEST[i+31:i] := remains unchanged*  ; Only merging masking is allowed

FI;

ENDFOR

k1[MAX_KL-1:KL] := 0

DEST[MAXVL-1:VL/2] := 0

VPGATHERQQ (EVEX encoded version)

(KL, VL) = (2, 64), (4, 128), (8, 256)

FOR j := 0 TO KL-1

i := j * 64

IF k1[j]

     THEN DEST[i+63:i] :=

             MEM[BASE_ADDR + (VINDEX[i+63:i]) * SCALE + DISP]

             k1[j] := 0

     ELSE *DEST[i+63:i] := remains unchanged*  ; Only merging masking is allowed

FI;

ENDFOR

k1[MAX_KL-1:KL] := 0

DEST[MAXVL-1:VL] := 0
```

## Intel C/C++ 内在编译器

```c
VPGATHERQD __m256i _mm512_i64gather_epi32(__m512i vdx, void * base, int scale);
VPGATHERQD __m256i _mm512_mask_i64gather_epi32lo(__m256i s, __mmask8 k, __m512i vdx, void * base, int scale);
VPGATHERQD __m128i _mm256_mask_i64gather_epi32lo(__m128i s, __mmask8 k, __m256i vdx, void * base, int scale);
VPGATHERQD __m128i _mm_mask_i64gather_epi32(__m128i s, __mmask8 k, __m128i vdx, void * base, int scale);
VPGATHERQQ __m512i _mm512_i64gather_epi64( __m512i vdx, void * base, int scale);
VPGATHERQQ __m512i _mm512_mask_i64gather_epi64(__m512i s, __mmask8 k, __m512i vdx, void * base, int scale);
VPGATHERQQ __m256i _mm256_mask_i64gather_epi64(__m256i s, __mmask8 k, __m256i vdx, void * base, int scale);
VPGATHERQQ __m128i _mm_mask_i64gather_epi64(__m128i s, __mmask8 k, __m128i vdx, void * base, int scale);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-63"Type E12类例外条件".
