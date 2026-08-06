---
summary: Carga MXCSR Registro
---

## Descripción

Carga el operando de origen en el registro de control MXCSR/status. El operando de origen es una ubicación de memoria de 32 bits. Ver "MXCSR Control and Status Register" en el Capítulo 10, del Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1, para una descripción del registro MXCSR y su contenido.

La instrucción LDMXCSR se utiliza típicamente en conjunción con la instrucción (V)STMXCSR, que almacena el contenido del registro MXCSR en memoria.

El valor predeterminado de MXCSR en reset es 1F80H.

Si una instrucción (V)LDMXCSR aclara un bit de máscara de excepción SIMD coma flotante y establece el bit de la bandera de excepción correspondiente, una excepción SIMD coma flotante no se generará inmediatamente. La excepción se generará sólo cuando se ejecute la siguiente instrucción que cumpla las dos condiciones siguientes:

* la instrucción debe funcionar en un XMM o YMM registro operando, * la instrucción hace que se reporte una excepción particular SIMD coma flotante.

La operación de esta instrucción es la misma en modos no-64-bit y modo 64-bit.

Si VLDMXCSR está codificado con VEX.L= 1, un intento de ejecutar la instrucción codificada con VEX.L= 1 causará una excepción #UD.

Nota: En VEX-versiones codificadas, VEX.vvvv está reservado y debe ser 1111b, de lo contrario las instrucciones #UD.

## Operación

```text
MXCSR := m32;

C/C++ Compiler Intrinsic Equivalent
_mm_setcsr(unsigned int i)
```

## Excepciones numéricas

None.

## Otras excepciones

Ver Tabla 2-22, "Tipo 5 Condiciones de Excepción", además:

```text
#GP                 For an attempt to set reserved bits in MXCSR.
```

```text
#UD                 If VEX.vvvv  1111B.
```
