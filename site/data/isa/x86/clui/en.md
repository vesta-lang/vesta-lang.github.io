---
summary: Clear User Interrupt Flag
---

## Description

CLUI clears the user interrupt flag (UIF). Its effect takes place immediately: a user interrupt cannot be delivered on the instruction boundary following CLUI. An execution of CLUI inside a transactional region causes a transactional abort; the abort loads EAX as it would have had it been caused due to an execution of CLI.

## Operation

```text
UIF := 0;
```

## Flags affected

None.
