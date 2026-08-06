---
summary: Informe de las capacidades de SMX
---

## Descripción

La función GETSEC[CAPABILITIES] devuelve un poco vector de funciones compatibles GETSEC hoja. El CAPABILITIES hoja de GETSEC es seleccionado con EAX fijado a 0 en la entrada. EBX es utilizado como el selector para devolver el campo de vectores bit en EAX. GETSEC[CAPABILITIES] puede ser ejecutado en todos los niveles de privilegio, pero el bit CR4.SMXE debe ser fijado o una excepción código de operación no definida (#UD) es devuelto.

Con EBX = 0 sobre la ejecución de GETSEC[CAPABILITIES], EAX devuelve el vector un poco que representa el estado sobre la presencia de un chipset compatible con Intel(R) TXT y las primeras 30 funciones disponibles GETSEC hoja. El formato del vector de bits devuelto se proporciona en la tabla 7-3.

Si el bit 0 se establece a 1, entonces un chipset compatible con Intel(R) TXT ha sido muestreado presente por el procesador. Si se establecen bits en el rango de 1-30, entonces la función GETSEC hoja correspondiente está disponible. Si el valor de bits en un índice de bits dado es 0, entonces la función GETSEC hoja correspondiente a ese índice no es compatible y los resultados de la prueba de ejecución en un

```text
#UD.
```

El bit 31 de EAX indica si se admiten más índices hoja. Si se establece el bit 31 de las hojas extendidas, las funciones adicionales de hoja se acceden repitiendo GETSEC[CAPABILITIES] con EBX aumentada por uno. Cuando el bit mas significativo de EAX no está establecido, entonces no se admiten funciones adicionales GETSEC hoja; indexar EBX a un valor más alto resultados en EAX volviendo cero.

**GETSEC Capability Result Encoding (EBX = 0)**

| Campo | Posición de bits | Descripción |
| --- | --- | --- |
| Chipset Present | 0 | Intel(R) TXT-capable chipset está presente. |
| Undefinido | 1 | Reservado |
| ENTERACCS | 2 | GETSEC[ENTERACCS] está disponible. |
| EXITAC | 3 | GETSEC[EXITAC] está disponible. |
| SENTER | 4 | GETSEC[SENTER] está disponible. |
| SEXIT | 5 | GETSEC[SEXIT] está disponible. |
| PARAMETERS | 6 | GETSEC[PARAMETERS] está disponible. |
| SMCTRL | 7 | GETSEC[SMCTRL] está disponible. |
| WAKEUP | 8 | GETSEC[WAKEUP] está disponible. |
| Undefinido | 30:9 | Reservado |
| Hojas extendidas | 31 | Reserved for extended information reporting of GETSEC capabilities. |
| GETSEC [CAPABILITIES]--Informe el | Capacidades SMX | SAFER  MODE  EXTENSIONS  REFERENCE |

## Operación

```text
IF (CR4.SMXE=0)
    THEN #UD;

ELSIF (in VMX non-root operation)
    THEN VM Exit (reason="GETSEC instruction");

IF (EBX=0) THEN
          BitVector := 0;
          IF (TXT chipset present)
                BitVector[Chipset present] := 1;
          IF (ENTERACCS Available)
                THEN BitVector[ENTERACCS] := 1;
          IF (EXITAC Available)
                THEN BitVector[EXITAC] := 1;
          IF (SENTER Available)
                THEN BitVector[SENTER] := 1;
          IF (SEXIT Available)
                THEN BitVector[SEXIT] := 1;
          IF (PARAMETERS Available)
                THEN BitVector[PARAMETERS] := 1;
          IF (SMCTRL Available)
                THEN BitVector[SMCTRL] := 1;
          IF (WAKEUP Available)
                THEN BitVector[WAKEUP] := 1;
          EAX := BitVector;

ELSE
    EAX := 0;

END;;
```

## Banderas afectadas

None.

Use of Prefixes

LOCK Causa #UD.

REP* Causa #UD (incluye REPNE/REPNZ y REP/REPE/REPZ).

Tamaño de operando Causa #UD.

No se permiten prefijos NP 66/F2/F3.

Segment anula Ignorado.

Tamaño de la dirección Ignorado.

REX              Ignored.
