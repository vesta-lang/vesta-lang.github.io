---
summary: Carga Global/Interrupt Descriptor Table Register
---

## Descripción

Carga los valores en el operando de origen en el registro mundial de tablas de descriptores (GDTR) o el registro de tablas de descriptores interrumpidos (IDTR). El operando de origen especifica una ubicación de memoria de 6 bytes que contiene la dirección base (una dirección lineal) y el límite (tamaño de tabla en bytes) de la tabla de descriptor global (GDT) o la tabla de descriptor de interrupción (IDT). Si el atributo operando-size es de 32 bits, un límite de 16 bits (abajo 2 bytes de los datos de 6 bytes operando) y una dirección base de 32 bits (aproximadamente 4 bytes de los datos operando) se cargan en el registro. Si el atributo el operando-size es de 16 bits, se carga un límite de 16 bits (menores 2 bytes) y una dirección base de 24 bits (tercero, cuarto y quinto byte). Aquí, el byte de alto orden del operando no se utiliza y el byte de alto orden de la dirección base en el GDTR o IDTR se llena de ceros.

Las instrucciones LGDT y LIDT se utilizan sólo en el software del sistema operativo; no se utilizan en los programas de aplicación. Son las únicas instrucciones que cargan directamente una dirección lineal (es decir, no una dirección relacionada con segmentos) y un límite en modo protegido. Se ejecutan comúnmente en modo de direccion real para permitir la inicialización del procesador antes de cambiar a modo protegido.

En modo de 64 bits, el tamaño de operando de la instrucción se fija en 8+2 bytes (una base de 8 bytes y un límite de 2 bytes). Vea la tabla resumen al comienzo de esta sección para la codificación de datos y límites.

Ver "SGDT--Store Global Descriptor Table Register" en el Capítulo 4, del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 2B, para información sobre el almacenamiento de los contenidos de GDTR y IDTR.

## Operación

```text
IF Instruction is LIDT
    THEN

        IF OperandSize = 16

                THEN
                      IDTR(Limit) := SRC[0:15];
                      IDTR(Base) := SRC[16:47] AND 00FFFFFFH;

                ELSE IF 32-bit Operand Size
                      THEN
                            IDTR(Limit) := SRC[0:15];
                            IDTR(Base) := SRC[16:47];
                      FI;

                ELSE IF 64-bit Operand Size (* In 64-Bit Mode *)
                      THEN
                            IDTR(Limit) := SRC[0:15];
                            IDTR(Base) := SRC[16:79];
                      FI;

          FI;
    ELSE (* Instruction is LGDT *)

        IF OperandSize = 16

                THEN
                      GDTR(Limit) := SRC[0:15];
                      GDTR(Base) := SRC[16:47] AND 00FFFFFFH;

                ELSE IF 32-bit Operand Size
                      THEN
                            GDTR(Limit) := SRC[0:15];
                            GDTR(Base) := SRC[16:47];
                      FI;

                ELSE IF 64-bit Operand Size (* In 64-Bit Mode *)
                      THEN
                            GDTR(Limit) := SRC[0:15];
                            GDTR(Base) := SRC[16:79];
                      FI;

          FI;
FI;
```

## Banderas afectadas

None.
