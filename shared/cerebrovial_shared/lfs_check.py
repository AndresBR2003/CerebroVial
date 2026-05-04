from pathlib import Path

_LFS_MAGIC = b"version https://git-lfs.github.com/spec/v1"


class LFSPointerError(RuntimeError):
    pass


def assert_real_binary(path: "Path | str") -> None:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(
            f"Model file not found: {p}\n"
            "Expected a real binary tracked by Git LFS.\n"
            "Run: git lfs pull"
        )
    with p.open("rb") as f:
        header = f.read(len(_LFS_MAGIC))
    if header == _LFS_MAGIC:
        raise LFSPointerError(
            f"'{p}' is a Git LFS pointer, not the real binary.\n"
            "Cause: git-lfs was not installed when the repo was cloned.\n"
            "Fix:\n"
            "  brew install git-lfs   # macOS  |  apt install git-lfs  # Linux\n"
            "  git lfs install\n"
            "  git lfs pull\n"
            "See README.md → 'Git LFS' section for details."
        )
