---
summary: 有条件的 SIMD 整数包装负载和存储
---

## 说明

有条件地从第二源操作数将打包的数据元素移动到目标操作数的相应数据元素中,这取决于每个数据元素相关的掩码位. 面具位点在 第一源操作数 中指定.

每个数据元素的掩码位是第一源操作数中该元素中最重要的位. 如果面具是1,则相应的数据元素从第二源操作数复制到目标操作数. 如果遮罩为0,则在这些指令的负载形式中将相应的数据元素设定为0,在存储形式中未修改.

第二源操作数是这些指令的负载形式的内存地址. 目标操作数是这些指令的存储形式的内存地址. 另一个操作数是XMM登记册(用于VEX.128版本)或YMM登记册(用于VEX.256版本).

故障仅因口罩位要求的内存访问导致故障而发生. 如果 内存位置 的相应掩码位为 0, 则不会因引用任何 内存位置 出现错误 。 例如,如果面具比特是全部零,就不会检测出故障.

与之前的MASKMOV指令(MASKMOVQ和MASKMOVDQU)不同,这些指令不应用非时空提示.

校正检查报告上使用低于所有1的口罩位的指令行为与所有1的口罩位的指令行为相同.

VMASKMOV不应用于访问所映射的I/O内存,因为单项负载或存储的顺序是具体执行的。

如果面具比特表示数据不应加载或存储呼号A和D比特,则将按执行方式设置. 然而,A和D比特总是为数据实际被加载/存储的页面设定.

注:对于负载表,第一个来源(口罩)编码为VEX.vvvv;第二个来源编码为rm field,目的地登记册编码为reg field.

注:对于存储表,第一个来源(面具)在VEX.vvvv编码;第二个来源寄存器在reg field编码,目的地内存位置在rm field编码.

## 行动

```text
VPMASKMOVD - 256-bit load
DEST[31:0] := IF (SRC1[31]) Load_32(mem) ELSE 0
DEST[63:32] := IF (SRC1[63]) Load_32(mem + 4) ELSE 0
DEST[95:64] := IF (SRC1[95]) Load_32(mem + 8) ELSE 0
DEST[127:96] := IF (SRC1[127]) Load_32(mem + 12) ELSE 0
DEST[159:128] := IF (SRC1[159]) Load_32(mem + 16) ELSE 0
DEST[191:160] := IF (SRC1[191]) Load_32(mem + 20) ELSE 0
DEST[223:192] := IF (SRC1[223]) Load_32(mem + 24) ELSE 0
DEST[255:224] := IF (SRC1[255]) Load_32(mem + 28) ELSE 0

VPMASKMOVD -128-bit load
DEST[31:0] := IF (SRC1[31]) Load_32(mem) ELSE 0
DEST[63:32] := IF (SRC1[63]) Load_32(mem + 4) ELSE 0
DEST[95:64] := IF (SRC1[95]) Load_32(mem + 8) ELSE 0
DEST[127:97] := IF (SRC1[127]) Load_32(mem + 12) ELSE 0
DEST[MAXVL-1:128] := 0

VPMASKMOVQ - 256-bit load
DEST[63:0] := IF (SRC1[63]) Load_64(mem) ELSE 0
DEST[127:64] := IF (SRC1[127]) Load_64(mem + 8) ELSE 0
DEST[195:128] := IF (SRC1[191]) Load_64(mem + 16) ELSE 0
DEST[255:196] := IF (SRC1[255]) Load_64(mem + 24) ELSE 0

VPMASKMOVQ - 128-bit load
DEST[63:0] := IF (SRC1[63]) Load_64(mem) ELSE 0
DEST[127:64] := IF (SRC1[127]) Load_64(mem + 16) ELSE 0
DEST[MAXVL-1:128] := 0

VPMASKMOVD - 256-bit store
IF (SRC1[31]) DEST[31:0] := SRC2[31:0]
IF (SRC1[63]) DEST[63:32] := SRC2[63:32]
IF (SRC1[95]) DEST[95:64] := SRC2[95:64]
IF (SRC1[127]) DEST[127:96] := SRC2[127:96]
IF (SRC1[159]) DEST[159:128] :=SRC2[159:128]
IF (SRC1[191]) DEST[191:160] := SRC2[191:160]
IF (SRC1[223]) DEST[223:192] := SRC2[223:192]
IF (SRC1[255]) DEST[255:224] := SRC2[255:224]


VPMASKMOVD - 128-bit store
IF (SRC1[31]) DEST[31:0] := SRC2[31:0]
IF (SRC1[63]) DEST[63:32] := SRC2[63:32]
IF (SRC1[95]) DEST[95:64] := SRC2[95:64]
IF (SRC1[127]) DEST[127:96] := SRC2[127:96]

VPMASKMOVQ - 256-bit store
IF (SRC1[63]) DEST[63:0] := SRC2[63:0]
IF (SRC1[127]) DEST[127:64] :=SRC2[127:64]
IF (SRC1[191]) DEST[191:128] := SRC2[191:128]
IF (SRC1[255]) DEST[255:192] := SRC2[255:192]

VPMASKMOVQ - 128-bit store
IF (SRC1[63]) DEST[63:0] := SRC2[63:0]
IF (SRC1[127]) DEST[127:64] :=SRC2[127:64]
```

## Intel C/C++ 内在编译器

```c
VPMASKMOVD: __m256i _mm256_maskload_epi32(int const *a, __m256i mask) VPMASKMOVD: void _mm256_maskstore_epi32(int *a, __m256i mask, __m256i b) VPMASKMOVQ: __m256i _mm256_maskload_epi64(__int64 const *a, __m256i mask);
VPMASKMOVQ: void _mm256_maskstore_epi64(__int64 *a, __m256i mask, __m256d b);
VPMASKMOVD: __m128i _mm_maskload_epi32(int const *a, __m128i mask) VPMASKMOVD: void _mm_maskstore_epi32(int *a, __m128i mask, __m128 b) VPMASKMOVQ: __m128i _mm_maskload_epi64(__int cont *a, __m128i mask);
VPMASKMOVQ: void _mm_maskstore_epi64(__int64 *a, __m128i mask, __m128i b);
```

## SIMD 浮点 例外

None.

## 其他例外

参见表2-23,"第6类例外条件"(没有任何口罩位组合的AC#报告).
