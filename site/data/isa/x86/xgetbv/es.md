---
summary: Consiga el valor de Extended registro de control
---

## Descripción

Lee el contenido del registro de control ampliado (XCR) especificado en el registro ECX en los registros EDX:EAX. (En los procesadores que soportan la arquitectura Intel 64, se ignoran los 32 bits de alto orden de RCX).El registro EDX se carga con los 32 bits de alto orden del XCR y el registro EAX se carga con los 32 bits de bajo orden. (En los procesadores que soportan la arquitectura Intel 64, los 32 bits de alto orden de cada uno de RAX y RDX son despejados.) Si se implementan menos de 64 bits en el XCR que se lee, los valores devueltos a EDX:EAX en sitios de bits unimplementados quedan indefinidas.

XCR0 es compatible con cualquier procesador que apoye la instrucción XGETBV. Si CPUID.0DH.01H:EAX.XGETBV1[2] = 1, ejecutando XGETBV con ECX = 1 devoluciones en EDX:EAX el lógico-AND de XCR0 y el valor actual del bitmap del estado-componente XINUSE. Esto permite que el software descubra el estado de la optimización de entrada utilizada por XSAVEOPT y XSAVES. Ver Capítulo 13, "Managing State Usando el Conjunto de Característica XSAVE", en Intel(R) 64 e IA-32 Architectures Software Developer's Manual, Volumen 1.

El uso de cualquier otro valor para ECX resulta en una excepción de protección general (#GP).

## Operación

```text
EDX:EAX := XCR[ECX];
```

## Banderas afectadas

None.

## Intel C/C++ compilador intrínseco

```c
XGETBV unsigned __int64 _xgetbv( unsigned int);
```
