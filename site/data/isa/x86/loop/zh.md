---
summary: 根据 ECX 计数器循环
---

## 说明

使用 RCX, ECX 或 CX 寄存器作为计数器进行循环操作(取决于地址大小是64位,32位,还是16位). 注意LOOP指令忽略了REX.W;但64位地址大小可以使用67H前缀被覆盖.

每次执行 LOOP 指令时,计数寄存器都会减少,然后检查为 0. 如果计数为0,则循环终止,程序执行继续按照LOOP指令执行指令. 如果计数不为零,则对目的地(目标)操作数进行近距离跳跃,这大概是循环开头的指令.

目标指令以相对偏移(相对于IP/EIP/RIP登记册中的指令指针的当前值,一个签名偏移)来指定. 这种偏移一般在组装码中被指定为标签,但在机器编码级别上,它被编码为一个签名的,8位的即时值,它被添加到指令指针中. 本指令允许128至+127的偏移。

一些形式的循环指令(LOOPcc)也接受ZF旗作为在计数达到零前终止循环的一个条件. 使用这些指示形式,每个指示都附有一个条件代码(cc),以说明所测试的条件。 在此,LOOPcc指令本身不影响ZF旗的状态;ZF旗由环中的其他指令更改.

## 行动

```text
IF (AddressSize = 32)

    THEN Count is ECX;
ELSE IF (AddressSize = 64)

    Count is RCX;
ELSE Count is CX;
FI;

Count := Count  1;

IF Instruction is not LOOP
    THEN
          IF (Instruction := LOOPE) or (Instruction := LOOPZ)

             THEN IF (ZF = 1) and (Count  0)

                            THEN BranchCond := 1;
                            ELSE BranchCond := 0;
                      FI;

             ELSE (Instruction = LOOPNE) or (Instruction = LOOPNZ)
                  IF (ZF = 0 ) and (Count  0)

                            THEN BranchCond := 1;
                            ELSE BranchCond := 0;
                      FI;


          FI;

   ELSE (* Instruction = LOOP *)
        IF (Count  0)

                THEN BranchCond := 1;

                ELSE BranchCond := 0;

          FI;

FI;

IF BranchCond = 1

    THEN
          IF in 64-bit mode (* OperandSize = 64 *)
                THEN
                      tempRIP := RIP + SignExtend(DEST);
                      IF tempRIP is not canonical
                            THEN #GP(0);
                      ELSE RIP := tempRIP;
                      FI;
                ELSE
                      tempEIP := EIP SignExtend(DEST);
                      IF OperandSize 16
                            THEN tempEIP := tempEIP AND 0000FFFFH;
                      FI;
                      IF tempEIP is not within code segment limit
                            THEN #GP(0);
                            ELSE EIP := tempEIP;
                      FI;
          FI;

    ELSE
          Terminate loop and continue program execution at (R/E)IP;

FI;
```

## 受影响的旗帜

None.
