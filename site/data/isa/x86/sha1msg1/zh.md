---
summary: 执行下四个 SHA1 信件词的中间计算
---

## 说明

SHA1MSG1指令是两个SHA1消息调度指令之一. 该指令对接下来的4个 SHA1 消息词进行中间计算.

## 行动

```text
SHA1MSG1
W0 := SRC1[127:96] ;
W1 := SRC1[95:64] ;
W2 := SRC1[63: 32] ;
W3 := SRC1[31: 0] ;
W4 := SRC2[127:96] ;
W5 := SRC2[95:64] ;

DEST[127:96] := W2 XOR W0;
DEST[95:64] := W3 XOR W1;
DEST[63:32] := W4 XOR W2;
DEST[31:0] := W5 XOR W3;
```

## Intel C/C++ 内在编译器

```c
SHA1MSG1 __m128i _mm_sha1msg1_epu32(__m128i, __m128i);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
