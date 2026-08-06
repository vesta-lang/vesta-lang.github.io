---
summary: 检查上界
---

## 说明

将第二个 操作数 中的地址与 bnd 中的上方绑定比较. 第二个操作数可以是寄存器,也可以是内存操作数. 如果地址高于bnd.UB中的上方约束,它会将BNDSTATUS设置为01H,并信号一个#BR例外.

BNDCU先在bnd的上界执行1的辅助操作,然后进行地址比较. BNDCN 直接使用 bnd 中已经返回到 1 补充形式的上方约束来进行地址比较。

此指令不会导致任何内存访问,也不会读写任何旗帜.

M32/64的有效地址计算行为与LEA相同

## 行动

```text
BNDCU BND, reg
IF reg > NOT(BND.UB) Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCU BND, mem
TEMP := LEA(mem);
IF TEMP > NOT(BND.UB) Then

    BNDSTATUS := 01H;
    #BR;
FI;

BNDCN BND, reg
IF reg > BND.UB Then

    BNDSTATUS := 01H;
    #BR;
FI;


BNDCN BND, mem
TEMP := LEA(mem);
IF TEMP > BND.UB Then

    BNDSTATUS := 01H;
    #BR;
FI;
```

## Intel C/C++ 内在编译器

```c
BNDCU .void _bnd_chk_ptr_ubounds(const void *q);
```

## 受影响的旗帜

None
