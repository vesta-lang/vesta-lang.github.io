---
summary: 检查下界
---

## 说明

将第二个 操作数 中的地址与 bnd 中的下限比较. 第二个操作数可以是寄存器,也可以是内存操作数. 如果地址低于bnd.LB中的下限,它会将BNDSTATUS设置为01H,并信号一个#BR例外.

此指令不会导致任何内存访问,也不会读写任何旗帜.

## 行动

```text
BNDCL BND, reg
IF reg < BND.LB Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCL BND, mem
TEMP := LEA(mem);
IF TEMP < BND.LB Then

    BNDSTATUS := 01H;
    #BR;
FI;
```

## Intel C/C++ 内在编译器

```c
BNDCL void _bnd_chk_ptr_lbounds(const void *q);
```

## 受影响的旗帜

None
