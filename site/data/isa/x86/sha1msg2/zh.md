---
summary: 执行下四 SHA1 信件词的最后计算
---

## 说明

SHA1MSG2指令是两个SHA1消息调度指令之一. 指令执行最后的计算,以得出下四个 SHA1 信件的字节 。

## 行动

```text
SHA1MSG2
W13 := SRC2[95:64] ;
W14 := SRC2[63: 32] ;
W15 := SRC2[31: 0] ;
W16 := (SRC1[127:96] XOR W13 ) ROL 1;
W17 := (SRC1[95:64] XOR W14) ROL 1;
W18 := (SRC1[63: 32] XOR W15) ROL 1;
W19 := (SRC1[31: 0] XOR W16) ROL 1;

DEST[127:96] := W16;
DEST[95:64] := W17;
DEST[63:32] := W18;
DEST[31:0] := W19;
```

## Intel C/C++ 内在编译器

```c
SHA1MSG2 __m128i _mm_sha1msg2_epu32(__m128i, __m128i);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
