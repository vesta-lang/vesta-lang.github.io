---
summary: 单精度浮点 的四边形值
---

## 说明

变量控制版本 :

第一源操作数(第二个操作数)中单精度浮点值的Permute四重奏,每个四重奏在第二源操作数的相应词元中使用2位控制字段. 被污染的结果被存储在目标操作数(第一个操作数)中.

2-位控制字段位于每个词元素的低二位(见图5-26)。 每个控件决定一个输入四重奏中哪一个源元素被选定为目的地元素. 每个四重源元素必须位于与目的地相同的128位区域.

EVEX 版本 : 第二源操作数(第三代操作数)是一个ZMM/YMM/XMM的注册,一个512/256/128位的内存位置或512/256/128位的向量从32位的内存位置广播. 写掩码下的标致结果被写入目的地.

SRC1 X7       X6  X5           X4      X3       X2                                  X1           X0

DEST X7 .. X4 X7 .. X4 X7 .. X4 X7 .. X4 X3 ..X0 X3 ..X0 X3 .. X0 X3 .. X0

图5-25. VPERMILPS 操作

255               226 225 224      63                                               34 33 32 31             Bit

```text
     ignored      sel . . .            ignored                                            sel    ignored  10
```

sel

```text
         Control Field 7                   Control Field 2                                           Control Field 1
```

图5-26. VPERMILPS 摇摆控制

(即时控制版本)

第一源操作数(第二位操作数)中单精度浮点值的Permute四重奏,每个四重奏使用imm8字节中的2位控制字段. 目标操作数(首个操作数)中的每个128位车道使用相同的imm8字节的四个控制域.

VEX 版本 : 源操作数是一个YMM/XMM登记册或256/128位的内存位置,目标操作数是一个YMM/XMM登记册.

EVEX 版本 : 源操作数(第二架操作数)是一个ZMM/YMM/XMM的收录器,512/256/128位内存位置或512/256/128位矢量从32位内存位置广播. 写掩码下的标致结果被写入目的地.

说明: 对于 imm8 版本, VEX.vvvv 和 EVEX.vvvv 保留, 必须是 1111b 否则指令会

```text
#UD.
```

## 行动

```text
Select4(SRC, control) {
CASE (control[1:0]) OF

    0: TMP := SRC[31:0];
    1: TMP := SRC[63:32];
    2: TMP := SRC[95:64];
    3: TMP := SRC[127:96];
ESAC;
RETURN TMP
}

VPERMILPS (EVEX immediate versions)
(KL, VL) = (4, 128), (8, 256), (16, 512)
FOR j := 0 TO KL-1

    i := j * 32
    IF (EVEX.b = 1) AND (SRC1 *is memory*)

          THEN TMP_SRC1[i+31:i] := SRC1[31:0];
          ELSE TMP_SRC1[i+31:i] := SRC1[i+31:i];
    FI;
ENDFOR;

TMP_DEST[31:0] := Select4(TMP_SRC1[127:0], imm8[1:0]);

TMP_DEST[63:32] := Select4(TMP_SRC1[127:0], imm8[3:2]);

TMP_DEST[95:64] := Select4(TMP_SRC1[127:0], imm8[5:4]);

TMP_DEST[127:96] := Select4(TMP_SRC1[127:0], imm8[7:6]); FI;

IF VL >= 256

     TMP_DEST[159:128] := Select4(TMP_SRC1[255:128], imm8[1:0]); FI;

     TMP_DEST[191:160] := Select4(TMP_SRC1[255:128], imm8[3:2]); FI;

     TMP_DEST[223:192] := Select4(TMP_SRC1[255:128], imm8[5:4]); FI;

     TMP_DEST[255:224] := Select4(TMP_SRC1[255:128], imm8[7:6]); FI;

FI;

IF VL >= 512

     TMP_DEST[287:256] := Select4(TMP_SRC1[383:256], imm8[1:0]); FI;

     TMP_DEST[319:288] := Select4(TMP_SRC1[383:256], imm8[3:2]); FI;

     TMP_DEST[351:320] := Select4(TMP_SRC1[383:256], imm8[5:4]); FI;

     TMP_DEST[383:352] := Select4(TMP_SRC1[383:256], imm8[7:6]); FI;

     TMP_DEST[415:384] := Select4(TMP_SRC1[511:384], imm8[1:0]); FI;

     TMP_DEST[447:416] := Select4(TMP_SRC1[511:384], imm8[3:2]); FI;

     TMP_DEST[479:448] := Select4(TMP_SRC1[511:384], imm8[5:4]); FI;

     TMP_DEST[511:480] := Select4(TMP_SRC1[511:384], imm8[7:6]); FI;

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*

                       THEN *DEST[i+31:i] remains unchanged*

                       ELSE DEST[i+31:i] := 0     ;zeroing-masking

                  FI;

     FI;

ENDFOR

DEST[MAXVL-1:VL] := 0


VPERMILPS (256-bit immediate version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC1[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC1[127:0], imm8[7:6]);
DEST[159:128] := Select4(SRC1[255:128], imm8[1:0]);
DEST[191:160] := Select4(SRC1[255:128], imm8[3:2]);
DEST[223:192] := Select4(SRC1[255:128], imm8[5:4]);
DEST[255:224] := Select4(SRC1[255:128], imm8[7:6]);

VPERMILPS (128-bit immediate version)
DEST[31:0] := Select4(SRC1[127:0], imm8[1:0]);
DEST[63:32] := Select4(SRC1[127:0], imm8[3:2]);
DEST[95:64] := Select4(SRC1[127:0], imm8[5:4]);
DEST[127:96] := Select4(SRC1[127:0], imm8[7:6]);
DEST[MAXVL-1:128] := 0

VPERMILPS (EVEX variable versions)

(KL, VL) = (16, 512)

FOR j := 0 TO KL-1

     i := j * 32

     IF (EVEX.b = 1) AND (SRC2 *is memory*)

          THEN TMP_SRC2[i+31:i] := SRC2[31:0];

          ELSE TMP_SRC2[i+31:i] := SRC2[i+31:i];

     FI;

ENDFOR;

TMP_DEST[31:0] := Select4(SRC1[127:0], TMP_SRC2[1:0]);

TMP_DEST[63:32] := Select4(SRC1[127:0], TMP_SRC2[33:32]);

TMP_DEST[95:64] := Select4(SRC1[127:0], TMP_SRC2[65:64]);

TMP_DEST[127:96] := Select4(SRC1[127:0], TMP_SRC2[97:96]);

IF VL >= 256

     TMP_DEST[159:128] := Select4(SRC1[255:128], TMP_SRC2[129:128]);

     TMP_DEST[191:160] := Select4(SRC1[255:128], TMP_SRC2[161:160]);

     TMP_DEST[223:192] := Select4(SRC1[255:128], TMP_SRC2[193:192]);

     TMP_DEST[255:224] := Select4(SRC1[255:128], TMP_SRC2[225:224]);

FI;

IF VL >= 512

     TMP_DEST[287:256] := Select4(SRC1[383:256], TMP_SRC2[257:256]);

     TMP_DEST[319:288] := Select4(SRC1[383:256], TMP_SRC2[289:288]);

     TMP_DEST[351:320] := Select4(SRC1[383:256], TMP_SRC2[321:320]);

     TMP_DEST[383:352] := Select4(SRC1[383:256], TMP_SRC2[353:352]);

     TMP_DEST[415:384] := Select4(SRC1[511:384], TMP_SRC2[385:384]);

     TMP_DEST[447:416] := Select4(SRC1[511:384], TMP_SRC2[417:416]);

     TMP_DEST[479:448] := Select4(SRC1[511:384], TMP_SRC2[449:448]);

     TMP_DEST[511:480] := Select4(SRC1[511:384], TMP_SRC2[481:480]);

FI;

FOR j := 0 TO KL-1

     i := j * 32

     IF k1[j] OR *no writemask*

          THEN DEST[i+31:i] := TMP_DEST[i+31:i]

          ELSE

                  IF *merging-masking*

                  THEN *DEST[i+31:i] remains unchanged*

                  ELSE DEST[i+31:i] := 0             ;zeroing-masking


                FI;
    FI;
ENDFOR
DEST[MAXVL-1:VL] := 0

VPERMILPS (256-bit variable version)
DEST[31:0] := Select4(SRC1[127:0], SRC2[1:0]);
DEST[63:32] := Select4(SRC1[127:0], SRC2[33:32]);
DEST[95:64] := Select4(SRC1[127:0], SRC2[65:64]);
DEST[127:96] := Select4(SRC1[127:0], SRC2[97:96]);
DEST[159:128] := Select4(SRC1[255:128], SRC2[129:128]);
DEST[191:160] := Select4(SRC1[255:128], SRC2[161:160]);
DEST[223:192] := Select4(SRC1[255:128], SRC2[193:192]);
DEST[255:224] := Select4(SRC1[255:128], SRC2[225:224]);
DEST[MAXVL-1:256] := 0

VPERMILPS (128-bit variable version)
DEST[31:0] := Select4(SRC1[127:0], SRC2[1:0]);
DEST[63:32] := Select4(SRC1[127:0], SRC2[33:32]);
DEST[95:64] :=Select4(SRC1[127:0], SRC2[65:64]);
DEST[127:96] := Select4(SRC1[127:0], SRC2[97:96]);
DEST[MAXVL-1:128] := 0
```

## Intel C/C++ 内在编译器

```c
VPERMILPS __m512 _mm512_permute_ps( __m512 a, int imm);
VPERMILPS __m512 _mm512_mask_permute_ps(__m512 s, __mmask16 k, __m512 a, int imm);
VPERMILPS __m512 _mm512_maskz_permute_ps( __mmask16 k, __m512 a, int imm);
VPERMILPS __m256 _mm256_mask_permute_ps(__m256 s, __mmask8 k, __m256 a, int imm);
VPERMILPS __m256 _mm256_maskz_permute_ps( __mmask8 k, __m256 a, int imm);
VPERMILPS __m128 _mm_mask_permute_ps(__m128 s, __mmask8 k, __m128 a, int imm);
VPERMILPS __m128 _mm_maskz_permute_ps( __mmask8 k, __m128 a, int imm);
VPERMILPS __m512 _mm512_permutevar_ps( __m512i i, __m512 a);
VPERMILPS __m512 _mm512_mask_permutevar_ps(__m512 s, __mmask16 k, __m512i i, __m512 a);
VPERMILPS __m512 _mm512_maskz_permutevar_ps( __mmask16 k, __m512i i, __m512 a);
VPERMILPS __m256 _mm256_mask_permutevar_ps(__m256 s, __mmask8 k, __m256 i, __m256 a);
VPERMILPS __m256 _mm256_maskz_permutevar_ps( __mmask8 k, __m256 i, __m256 a);
VPERMILPS __m128 _mm_mask_permutevar_ps(__m128 s, __mmask8 k, __m128 i, __m128 a);
VPERMILPS __m128 _mm_maskz_permutevar_ps( __mmask8 k, __m128 i, __m128 a);
VPERMILPS __m128 _mm_permute_ps (__m128 a, int control);
VPERMILPS __m256 _mm256_permute_ps (__m256 a, int control);
VPERMILPS __m128 _mm_permutevar_ps (__m128 a, __m128i control);
VPERMILPS __m256 _mm256_permutevar_ps (__m256 a, __m256i control);
```

## SIMD 浮点 例外

None.

## 其他例外

Non-EVEX-encoded discription,参见表2-21"第4类例外条件".

Additionally:

```text
#UD                    If VEX.W = 1.
```

EVEX-encoded discription,参见表2-52,"Type E4NF类例外条件".

Additionally:

```text
#UD                    If either (E)VEX.vvvv != 1111B and with imm8.
```
