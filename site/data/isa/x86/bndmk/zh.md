---
summary: 制造边界
---

## 说明

从第二个 操作数 开始设定界限,并将下限和上限存储在绑定注册 bnd 中。 第二个操作数必须是内存操作数. 内存操作数的基寄寄存器内容存储在下限bnd.LB. 有效地址m32/m64的1'补充被存储在上绑定b.UB. M32/m64的计算行为与LEA相同.

此指令不会导致任何内存访问,也不会读写任何旗帜.

如果指令没有指定基准寄存器,则下限为零。 本指令的reg-reg形式保留了遗留行为(NOP).

该指令如果在64位模式下以RIP-relative地址执行,则导致无效-操作码例外(#UD).

## 行动

```text
BND.LB := SRCMEM.base;
IF 64-bit mode Then

    BND.UB := NOT(LEA.64_bits(SRCMEM));
ELSE

    BND.UB := Zero_Extend.64_bits(NOT(LEA.32_bits(SRCMEM)));
FI;
```

## Intel C/C++ 内在编译器

```c
BNDMKvoid * _bnd_set_ptr_bounds(const void * q, size_t size);
```

## 受影响的旗帜

None.
