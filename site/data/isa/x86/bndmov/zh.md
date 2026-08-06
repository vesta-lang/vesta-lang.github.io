---
summary: 移动边界
---

## 说明

BNDMOV从源操作数(第二个操作数)移动一对下限和上限值到目的地(第一个操作数). 每个操作都是128位移动. 例外与MOV指令相同. 以64位模式加载/存储边框的内存格式见图3-5.

```text
                     Upper Bound (UB)             Lower Bound (LB)                     BNDMOV to memory in 64-bit mode
                     16                                             8                                           0 Byte offset
```

```text
             Upper Bound (UB)                     Lower Bound (LB)                     BNDMOV to memory in 32-bit mode
             16                                                     8
                                                                                    4      0 Byte offset
```

图3-5。 BNDMOV 内存布局到/ 从内存

此指令不更改旗帜 。

## 行动

```text
BNDMOV register to register
DEST.LB := SRC.LB;
DEST.UB := SRC.UB;


BNDMOV from memory
IF 64-bit mode THEN

          DEST.LB := LOAD_QWORD(SRC);
          DEST.UB := LOAD_QWORD(SRC+8);
    ELSE
          DEST.LB := LOAD_DWORD_ZERO_EXT(SRC);
          DEST.UB := LOAD_DWORD_ZERO_EXT(SRC+4);
FI;

BNDMOV to memory
IF 64-bit mode THEN

          DEST[63:0] := SRC.LB;
          DEST[127:64] := SRC.UB;
    ELSE
          DEST[31:0] := SRC.LB;
          DEST[63:32] := SRC.UB;
FI;
```

## Intel C/C++ 内在编译器

```c
BNDMOV void * _bnd_copy_ptr_bounds(const void *q, const void *r);
```

## 受影响的旗帜

None.
