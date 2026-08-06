---
summary: 如果条件满足, 则比较和添加
---

## 说明

本指令将内存中的值与第二个操作数的值进行比较. 如果满足了指定的条件,那么处理器会将第三个 操作数 添加到 内存操作数 中并写入内存,否则内存会被这个指令所改变.

此指令必须使 MODRM.MOD 等于 0, 1 或 2 。 MODRM.MOD的值为3,将会导致无效的操作码例外(#UD).

第二个操作数总是以内存操作数的原始值更新. EFLAGS条件通过比较结果更新. 指令使用隐含锁. 本指令不允许使用明确的锁定前缀.

## 行动

```text
CMPCCXADD srcdest1, srcdest2, src3
tmp1 := load lock srcdest1
tmp2 := tmp1 + src3
EFLAGS.CS,OF,SF,ZF,AF,PF := CMP tmp1, srcdest2
IF <condition>:

    srcdest1 := store unlock tmp2
ELSE

    srcdest1 := store unlock tmp1
srcdest2 :=tmp1

1. ModRM.MOD != 011B
```

## 受影响的旗帜

EFLAGS条件由比较结果更新.

## Intel C/C++ 内在编译器

```c
CMPCCXADD int _cmpccxadd_epi32 (void* __A, int __B, int __C, const int __D);
CMPCCXADD __int64 _cmpccxadd_epi64 (void* __A, __int64 __B, __int64 __C, const int __D);
```

## SIMD 浮点 例外

None.

例外14型;见表2-31。
