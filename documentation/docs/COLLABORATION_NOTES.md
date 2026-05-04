# Notas de colaboración — Método de trabajo

Este documento describe **cómo trabajamos** en CerebroVial. No es un manual rígido, es la cristalización de las prácticas que se fueron formando durante Fase 0 y Fase 1, y que demostraron funcionar bien.

Para entender **qué hicimos** ver:
- `20260503_PHASE1_CLOSURE.md` — cierre de Fase 1.
- `PLAN.md` — plan general de fases.
- `DECISIONS.md` — decisiones arquitectónicas tomadas.
- `TODO.md` — backlog completo con prioridades.

---

## Roles en el equipo

**Andrés y Cesar** — documento de tesis, decisiones académicas, validación con asesor, implementación, gestión del repo, coordinación técnica.

**Claude (chat)** — partner de planificación. Recibe contexto, propone planes, revisa outputs, anticipa riesgos. No toca el repo directamente. Vive en sesiones largas que cubren una fase entera.

**Claude Code** — ejecutor. Recibe prompts en plan mode, propone planes detallados archivo por archivo, ejecuta cuando se aprueban, hace los commits. Vive en sesiones cortas, una por tarea.

La separación importa: Claude (chat) mantiene la coherencia entre tareas y la visión de fase; Claude Code se enfoca en una tarea aislada con scope acotado. Las dos herramientas no se suplantan.

---

## Convenciones de trabajo

### Una tarea, una sesión de Claude Code

Cada tarea del backlog (C1, C2, C3, etc.) abre una sesión nueva de Claude Code. No se acumulan tareas en la misma sesión porque el contexto se infla y empieza a alucinar referencias o arrastrar decisiones de tareas anteriores que no se aplican.

### Plan mode obligatorio antes de tocar nada

Toda sesión de Claude Code arranca con `Shift+Tab` (dos veces) para entrar en plan mode. Se pega el prompt completo, se espera el plan, se revisa, y solo se aprueba con luz verde explícita. Si el plan tiene problemas, se pide ajuste antes de aprobar.

### Verificación previa antes de planear

Cada prompt para Claude Code incluye **pre-condiciones verificables** que el plan tiene que confirmar antes de avanzar:
- `git status` working tree clean.
- Branch correcta.
- Archivos relevantes existen donde se asume.
- Dependencias instaladas.

Si alguna pre-condición falla, el plan no avanza, se reporta al usuario.

### Empírica > regla heurística

Cuando hay duda, se inspecciona el código real, no se asume. Ejemplos concretos:
- Para C7 (limpiar requirements), Claude Code escaneó imports reales en lugar de aplicar la lista del plan original a ciegas. Encontró que torch sí se importaba (vía STGNN en `models.py`), evitando romper 18 tests.
- Para C9 (LFS), confirmó el inventario con `git ls-files` en lugar de confiar en el conteo del prompt. Detectó que eran 17 archivos, no 15.

Esta es una de las prácticas más valiosas: la fuente de verdad es el repo, no la memoria.

### Commits acotados con prefijo de tarea

Cada commit cierra una tarea concreta del TODO y lleva el prefijo correspondiente:
- `[Cn]` para tareas del bloque C de Fase 1.
- `[Cn.m]` para sub-tareas o splits.
- `[Cn-prep]` para commits de preparación de una tarea (ej. C9-prep antes de C9 porque LFS migrate requería working tree limpio).
- `[chore]` para mantenimiento operativo (gitignore, etc.).
- `[Fase N]` para commits ceremoniales que cierran una fase.

El mensaje del commit incluye:
- Resumen de qué se hizo y por qué.
- Lista concreta de archivos tocados o cambios clave.
- Referencias a `docs/TODO.md` y `docs/DECISIONS.md` cuando aplique.

### Validación después de cada cambio

Después de cada commit, se valida que el sistema sigue funcionando. Tests verdes, `docker compose up` (o `invoke up`) levanta sin crashes, endpoints responden. Si algo se rompe, se diagnostica antes de avanzar al siguiente commit.

### Deuda registrada, no escondida

Cuando se descubre algo durante una tarea que no es parte del scope original (un bug preexistente, una mejora opcional, una vulnerabilidad), se registra en `docs/TODO.md` como un nuevo ítem con:
- Descripción concreta del problema.
- Síntoma o consecuencia observable.
- Opciones de solución.
- Prioridad y momento de resolución (qué fase).

No se intenta resolver fuera de scope. La regla es **una tarea, un commit, scope claro**.

Ejemplos de deuda derivada de Fase 1: C1.6, C1.7, C1.8, C3.5, C7.5, C9.5, C9.6, C10.1, C10.2.

### Tests preexistentes rotos: xfail, no skip

Tests que ya fallaban antes del trabajo actual se marcan como `xfail` con un `reason` específico que documente:
- Causa técnica del fallo.
- Confirmación de que es preexistente (verificación contra commit pre-refactor).
- Referencia al ítem del TODO que trackea su resolución.

Esto preserva la información de la deuda y permite que `pytest` salga en verde sin esconder problemas.

---

## Flujo típico de una tarea

```
1. Identificar próxima tarea en docs/TODO.md.
2. Conversación con Claude (chat) para refinar alcance y armar prompt.
3. Verificación previa local: git status, grep relevante, etc.
4. Sesión nueva de Claude Code en plan mode.
5. Pegar prompt, esperar plan.
6. Revisar plan con Claude (chat). Aprobar o pedir ajustes.
7. Aprobar a Claude Code → ejecuta y commitea.
8. Validar localmente: tests, docker compose, endpoints.
9. Pegar outputs a Claude (chat) para confirmación de cierre.
10. Marcar la tarea como [x] en TODO.md (o ya quedó marcada en el commit).
```

Si algún paso falla, no se avanza al siguiente. La disciplina de no acumular fallos es lo que mantuvo Fase 1 cerrable en plazo.

---

## Convenciones de Git

### Branches

- `master` — estado actual, lo que está en producción conceptualmente.
- `fase-N-...` — branches de fase, una por cada bloque grande de trabajo.
- Después del cierre de fase, merge a `master`. La branch de fase se borra del remoto.

### Force push

Está permitido en branches de fase **antes** del merge a `master`. Se usa con `--force-with-lease` (no `--force` directo) para que git aborte si alguien más pusheó al remoto desde la última sincronización.

Operaciones que reescriben history y requieren force push:
- `git lfs migrate import` (caso de C9).

Antes de cualquier force push se avisa al equipo, porque rompe copias locales del que tiene la branch checked out.

### Git LFS

El repo usa LFS para binarios. Reglas en `.gitattributes`:
- `*.joblib`, `*.pt`, `*.ckpt`, `*.h5`, `*.npy`, `*.docx`

**Prerequisito de setup:** instalar git-lfs antes del primer clone. Si se clona sin LFS, los binarios bajan como pointers de texto y el sistema falla al cargar modelos. Ver `README.md` raíz para detalle.

`invoke check-lfs` valida automáticamente que los binarios sean reales antes de cualquier `invoke up`.

---

## Comandos del día a día

Todos via `invoke <comando>`. Ver `README.md` raíz para tabla completa. Los más frecuentes:

```
invoke up           # levantar el sistema
invoke down         # apagar
invoke logs         # logs en vivo
invoke health       # validar /api/health
invoke test         # correr tests (requiere venv activo)
invoke setup-dev    # crear venv local con deps de dev
```

`invoke` es cross-platform (Mac, Linux, Windows). Requiere `pip install invoke` una vez por máquina.

---

## Cómo arrancar una sesión nueva con Claude (chat)

Mensaje inicial corto, apuntando a los documentos de verdad:

```
Estoy retomando trabajo del proyecto CerebroVial. Cerramos Fase 1
el 3 de mayo. Para contexto del estado y método de trabajo, lee:

- documentation/docs/20260503_PHASE1_CLOSURE.md
- documentation/docs/COLLABORATION_NOTES.md (este archivo)
- documentation/docs/TODO.md
- CLAUDE.md raíz

Hoy quiero arrancar con [tarea concreta de Fase 2].
```

No hace falta pegar resúmenes extensos. Los documentos viven en el repo y son la fuente de verdad. Claude puede buscar en chats anteriores si necesita profundizar en alguna decisión específica.

---

## Para futuras fases

Cuando arranque Fase 2:

1. Crear branch `fase-2-...` desde `master` actualizado.
2. Definir las tareas del bloque correspondiente en `TODO.md` (ya están listadas en `PLAN.md`).
3. Aplicar el mismo método: una sesión por tarea, plan mode, validación, commit ceremonial al cierre.
4. Al cerrar Fase 2, crear `documentation/docs/AAAAMMDD_PHASE2_CLOSURE.md` con el mismo template que el de Fase 1.

La disciplina del método importa más que el método específico. Si en algún momento descubrimos una mejora al flujo, se documenta acá.