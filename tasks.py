"""
Tareas de invoke para CerebroVial.
Ejecutar con: invoke <target>
Ver lista completa: invoke --list
"""
from invoke import task
import sys
import platform


# === Helpers ===

def _print_box(title, lines):
    """Imprime un mensaje destacado, multilínea, con bordes."""
    width = max(len(title), max(len(l) for l in lines)) + 4
    print()
    print("=" * width)
    print(f"  {title}")
    print("=" * width)
    for l in lines:
        print(f"  {l}")
    print("=" * width)
    print()


# === Validación de entorno ===

@task
def check_lfs(c):
    """Verifica que los binarios LFS sean reales y no pointers de texto."""
    import os

    sentinel = "core_management_api/models/traffic_rf_class_current.joblib"
    if not os.path.exists(sentinel):
        _print_box("ERROR: archivo de modelo no encontrado", [
            f"Path esperado: {sentinel}",
            "",
            "Probablemente el clone fue parcial o git-lfs no está activo.",
            "Solución:",
            "  1. Instalá git-lfs:",
            "       macOS:  brew install git-lfs",
            "       Linux:  apt install git-lfs",
            "       Windows: https://git-lfs.com (descargar instalador)",
            "  2. git lfs install",
            "  3. git lfs pull",
        ])
        sys.exit(1)

    # Detectar pointer LFS leyendo los primeros bytes
    with open(sentinel, "rb") as f:
        head = f.read(64)
    if head.startswith(b"version https://git-lfs"):
        _print_box("ERROR: archivos LFS son pointers, no binarios reales", [
            "Los modelos .joblib y .pt están como punteros de texto.",
            "Esto significa que git-lfs no descargó los binarios.",
            "",
            "Solución:",
            "  1. Instalá git-lfs (ver instrucciones en README.md).",
            "  2. git lfs install",
            "  3. git lfs pull",
            "",
            "Después de pullear, volvé a correr este comando.",
        ])
        sys.exit(1)

    print("✓ LFS OK — binarios presentes y reales")


# === Comandos del día a día ===

@task(pre=[check_lfs])
def up(c):
    """Levantar el sistema (db + core_management_api + edge_device)."""
    c.run("docker compose up -d --remove-orphans", pty=False)
    print()
    print("✓ Sistema levantado.")
    print("  - core_management_api: http://localhost:8001")
    print("  - edge_device:         http://localhost:8000")
    print("  - frontend (manual):   cd frontend_ui && npm run dev")
    print()
    print("Ver logs: invoke logs")
    print("Apagar:   invoke down")


@task(pre=[check_lfs])
def up_build(c):
    """Levantar el sistema con rebuild de imágenes (después de tocar Dockerfile o requirements)."""
    c.run("docker compose up -d --build --remove-orphans", pty=False)
    print("\n✓ Sistema levantado (con rebuild).")


@task
def down(c):
    """Apagar el sistema."""
    c.run("docker compose down", pty=False)


@task
def logs(c):
    """Ver logs en vivo de todos los servicios."""
    c.run("docker compose logs -f", pty=False)


@task
def ps(c):
    """Estado actual de los containers."""
    c.run("docker compose ps", pty=False)


@task
def health(c):
    """Validar que core_management_api responde."""
    c.run("curl -i http://localhost:8001/api/health", pty=False, warn=True)


# === Builds limpios ===

@task(pre=[check_lfs])
def rebuild(c):
    """Build limpio de imágenes (sin cache de capas), conservando volúmenes."""
    c.run("docker compose build --no-cache", pty=False)
    c.run("docker compose up -d --remove-orphans", pty=False)
    print("\n✓ Rebuild completado, sistema arriba.")


@task(pre=[check_lfs])
def rebuild_clean(c):
    """Build nuclear: borra volúmenes (incluida DB), pulls fresh, rebuilds, levanta. ATENCIÓN: borra datos de la DB."""
    confirm = input("⚠️  Esto BORRA los datos de la DB. ¿Continuar? [y/N]: ").strip().lower()
    if confirm != "y":
        print("Cancelado.")
        return
    c.run("docker compose down -v", pty=False)
    c.run("docker compose build --no-cache --pull", pty=False)
    c.run("docker compose up -d --remove-orphans", pty=False)
    print("\n✓ Rebuild-clean completado.")


# === Setup y tests ===

@task
def setup_dev(c):
    """Crear venv local con todas las dependencias de desarrollo."""
    is_windows = platform.system() == "Windows"
    venv_python = ".venv\\Scripts\\python.exe" if is_windows else ".venv/bin/python"

    print("Creando venv en .venv/ ...")
    c.run("python -m venv .venv" if is_windows else "python3.11 -m venv .venv", pty=False)
    c.run(f"{venv_python} -m pip install --upgrade pip", pty=False)
    c.run(f"{venv_python} -m pip install -e ./shared", pty=False)
    c.run(f"{venv_python} -m pip install -r core_management_api/requirements.txt", pty=False)
    c.run(f"{venv_python} -m pip install -r edge_device/requirements.txt", pty=False)
    c.run(f"{venv_python} -m pip install -r requirements-dev.txt", pty=False)

    activate = ".venv\\Scripts\\activate" if is_windows else "source .venv/bin/activate"
    _print_box("✓ Venv creado en .venv/", [
        f"Activalo con: {activate}",
        "Después podés correr: invoke test",
    ])


@task
def test(c):
    """Correr tests de core_management_api y edge_device.
    Asume que el venv está activo y tiene pytest instalado.
    Si falla con 'No module named pytest', correr 'invoke setup-dev' primero
    y activar el venv.
    """
    print("=== core_management_api ===")
    c.run("cd core_management_api && python -m pytest tests/ -v", pty=False, warn=True)
    print("\n=== edge_device ===")
    c.run("cd edge_device && python -m pytest tests/ -v", pty=False, warn=True)


# === Help ===

@task(default=True)
def help(c):
    """Muestra los comandos disponibles."""
    c.run("invoke --list", pty=False)
