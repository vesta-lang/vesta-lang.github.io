---
summary: 计算四轮后 SHA1 状态变量 E
---

## 说明

SHA1NEXTE从目标操作数当前SHA1状态变量A的四轮运行后计算SHA1状态变量E. SHA1状态变量E的计算值被添加到源操作数中,其中包含计划词.

## 行动

```text
SHA1NEXTE
TMP := (SRC1[127:96] ROL 30);

DEST[127:96] := SRC2[127:96] + TMP;
DEST[95:64] := SRC2[95:64];
DEST[63:32] := SRC2[63:32];
DEST[31:0] := SRC2[31:0];
```

## Intel C/C++ 内在编译器

```c
SHA1NEXTE __m128i _mm_sha1nexte_epu32(__m128i, __m128i);
```

## 受影响的旗帜

None.

## SIMD 浮点 例外

None.

## 其他例外

参见表2-21"第4类例外条件".
