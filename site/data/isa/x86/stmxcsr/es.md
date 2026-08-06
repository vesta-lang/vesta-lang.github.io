---
summary: Store MXCSR Register State
---

## Descripción

Almacena el contenido del control MXCSR y registro de estado al operando de destino. El operando de destino es una ubicación de memoria de 32 bits. Los bits reservados en el registro MXCSR se almacenan como 0s. La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit. VEX.L debe ser 0, de lo contrario las instrucciones #UD. Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
m32 := MXCSR;
```

## Intel C/C++ compilador intrínseco

```c
_mm_getcsr(void);
```

## SIMD coma flotante Excepciones

None.

## Otras excepciones

Ver Tabla 2-22, "Tipo 5 Condiciones de Excepción", además:

```text
#UD                  If VEX.L= 1,
```

```text
                     If VEX.vvvv  1111B.
```
