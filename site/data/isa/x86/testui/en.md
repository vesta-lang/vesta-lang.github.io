---
summary: Determine User Interrupt Flag
---

## Operation

```text
CF := UIF;
ZF := AF := OF := PF := SF := 0;
```

## Flags affected

The ZF, OF, AF, PF, SF flags are cleared and the CF flags to the value of the user interrupt flag.
