---
summary: 为用户页面读取保护 密钥 权利
---

## 说明

将PKRU的值读入EAX,并清除EDX. ECX在RDPKRU执行时必须是0;否则,会出现一般保护例外(#GP).

RDPKRU只有在CR4.PKE=1的情况下才能执行;否则,会出现无效的-操作码例外(#UD). 软件可以通过检查CPUID.07H.00H:ECX.OSPKE[4]来发现CR4.PKE的值.

在支持Intel 64 Architecture的处理器上,RCX的高阶32位被忽略,RDX和RAX的高阶32位被清除.

## 行动

```text
IF (ECX = 0)
    THEN
          EAX := PKRU;
          EDX := 0;
    ELSE #GP(0);

FI;
```

## 受影响的旗帜

None.

C/C++ 汇编器内置等效的 RDPKRU uint32 t  rdpkru u32(void);
