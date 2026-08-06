---
summary: 将数据写入用户页面 密钥 注册
---

## 说明

将 EAX 的值写入 PKRU 。 ECX和EDX在WRPKRU执行时必须是0;否则,会出现一般保护例外(#GP).

WRPKRU只有在CR4.PKE=1的情况下才能执行;否则,会出现无效的-操作码例外(#UD). 软件可以通过检查CPUID.07H.00H:ECX.OSPKE[4]来发现CR4.PKE的值.

在支持Intel 64 Architecture的处理器上,RCX,RDX和RAX的高序32位被忽略.

WRPKRU永远不会进行投机性执行. 受PKRU登记册影响的内存访问将不会执行(甚至推测),直到所有先前对WRPKRU的处决完成并更新PKRU登记册.

## 行动

```text
IF (ECX = 0 AND EDX = 0)
    THEN PKRU := EAX;
    ELSE #GP(0);

FI;
```

## 受影响的旗帜

None.

C/C++ 编译器内置等效 WRPKRU 空格 wrpkru(init32 t);
