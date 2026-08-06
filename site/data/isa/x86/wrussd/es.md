---
summary: Escribe a User Shadow Stack
---

## Descripción

Escribe bytes en la fuente de registro a una pila de sombras de usuario pag.

## Operación

```text
IF CR4.CET = 0
    THEN #UD; FI;

IF CPL > 0
    THEN #GP(0); FI;

DEST_LA = Linear_Address(mem operand)
IF (operand size is 64 bit)

    THEN
          (* Destination not 8B aligned *)
          IF DEST_LA[2:0]
                THEN GP(0); FI;
          Shadow_stack_store 8 bytes of SRC to DEST_LA as user-mode access;

    ELSE
          (* Destination not 4B aligned *)
          IF DEST_LA[1:0]
                THEN GP(0); FI;
          Shadow_stack_store 4 bytes of SRC[31:0] to DEST_LA as user-mode access;

FI;
```

## Banderas afectadas

None.

C/C++ Compilador Equivalente Intrínseco

WRUSSD void  wrussd(   int32, void *); WRUSSQ void  wrussq(   int64, void *);
