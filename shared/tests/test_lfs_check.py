import pytest
from pathlib import Path
from cerebrovial_shared.lfs_check import assert_real_binary, LFSPointerError


def test_assert_real_binary_valid_file(tmp_path: Path) -> None:
    model = tmp_path / "model.joblib"
    model.write_bytes(b"\x80\x04\x95some binary content")
    assert_real_binary(model)  # must not raise


def test_assert_real_binary_lfs_pointer(tmp_path: Path) -> None:
    pointer = tmp_path / "model.joblib"
    pointer.write_text(
        "version https://git-lfs.github.com/spec/v1\n"
        "oid sha256:abc123\n"
        "size 2847622\n"
    )
    with pytest.raises(LFSPointerError) as exc_info:
        assert_real_binary(pointer)
    assert str(pointer) in str(exc_info.value)


def test_assert_real_binary_missing(tmp_path: Path) -> None:
    missing = tmp_path / "nonexistent.joblib"
    with pytest.raises(FileNotFoundError):
        assert_real_binary(missing)
