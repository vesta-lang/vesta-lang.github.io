---
summary: Palabra de estado de la máquina
---

## Descripción

Almacena la palabra estado de la máquina (bits 0 a 15 de registro de control CR0) al operando de destino. El operando de destino puede ser un registro de proposito general o una ubicación de memoria.

En modos no-64-bit, cuando el operando de destino es un registro de 32 bits, los 16 bits de bajo orden del registro CR0 se copian en los 16 bits de bajo orden del registro y los 16 bits de alto orden quedan indefinidas. Cuando el operando de destino es una ubicación de memoria, los 16 bits de bajo orden de registro CR0 están escritos a la memoria como una cantidad de 16 bits, independientemente del tamaño de operando.

En el modo 64-bit, el comportamiento de la instrucción SMSW se define por los siguientes ejemplos:

* SMSW r16 tamaño de operando 16, almacenar CR0[15:0] en r16 * SMSW r32 tamaño de operando 32, CR0 de cero, y almacenar en r32 * SMSW r64 tamaño de operando 64, CR0 de cero, y almacenar en r64 * SMSW m16 tamaño de operando 16, almacenar CR0[15:0] en m16 * SMSW m16 tamaño de operando 32, store CR0[15:0] in m16 (not m32) * SMSW m16 operandos tamaño 64, almacenar CR0[15:0] en m16 (no m64)

SMSW es sólo útil en el software del sistema operativo. Sin embargo, no es una instrucción privilegiada y se puede utilizar en programas de aplicación si CR4.UMIP = 0. Se proporciona para la compatibilidad con el procesador Intel 286. Los programas y procedimientos destinados a ejecutar en procesadores IA-32 e Intel 64 comenzando con los procesadores Intel386 deben utilizar la instrucción MOV CR para cargar la palabra estado de la máquina. Ver "Cambios para el comportamiento de la instrucción en VMX Operación no-rota" en el capítulo 27 de Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 3C, para obtener más información sobre el comportamiento de esta instrucción en VMX operación no-raíz.

## Operación

```text
DEST := CR0[15:0];
(* Machine status word *)
```

## Banderas afectadas

None.
