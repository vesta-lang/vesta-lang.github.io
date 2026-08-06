---
summary: No serializar Escribe a Modelo de Registro Específico
---

## Descripción

WRMSRNS es una instrucción que se comporta como WRMSR excepto que no es una instrucción serializante por defecto. Se puede ejecutar sólo a nivel de privilegios 0 o en modo de direccion real; de lo contrario, una excepción de protección general #GP(0) se genera.

La instrucción escribe el contenido de los registros EDX:EAX en el registro específico del modelo de 64 bits (MSR) especificado en el registro ECX. Los contenidos del registro EDX se copian a los 32 bits de alto orden del MSR seleccionado y los contenidos del registro EAX se copian a los 32 bits de bajo orden del MSR. Se ignoran los 32 bits de alto orden de RAX, RCX y RDX.

A diferencia de WRMSR, WRMSRNS no se define como una instrucción serializadora (ver "Instrucciones de serialización" en el capítulo 11 de Intel(R) 64 y IA-32 Architectures Software Developer's Manual, Volumen 3A). Esto significa que el software no debe confiar en él para drenar todas las escrituras amortiguadas a la memoria antes de que la siguiente instrucción sea traída y ejecutada. Por razones de aplicación, algunos procesadores pueden serializarse cuando escriben ciertos MSR, aunque eso no esté garantizado.

Al igual que WRMSR, WRMSRNS asegurará que todas las operaciones antes de que no usen el nuevo valor MSR y que todas las operaciones después del WRMSRNS utilizan el nuevo valor. Una excepción a esta regla es ciertos eventos de monitor de rendimiento relacionados con la tienda que sólo cuentan tiendas cuando se drenan a la memoria. Puesto que WRMSRNS no es una instrucción serializadora, si el software utiliza WRMSRNS para cambiar los controles para tales eventos de monitorización de rendimiento, las tiendas emitidas antes de WRMSRMS pueden ser contados sobre la base de los controles establecidos por WRMSRNS. El software puede insertar la instrucción SERIALIZE antes del WRMSRNS si así lo desea.

Los MSR que causan una invalidación TLB cuando se escriben a través de WRMSR (por ejemplo, MTRR) también causarán la misma invalidación TLB cuando se escribe por WRMSRNS.

Para mejorar el rendimiento, el software puede reemplazar WRMSR por WRMSRNS. En lugares donde WRMSR está siendo utilizado como un proxy para una instrucción de serialización, se puede utilizar una instrucción de serialización diferente (por ejemplo, SERIALIZE).

## Operación

```text
MSR[ECX] := EDX:EAX;
```

## Banderas afectadas

None.
