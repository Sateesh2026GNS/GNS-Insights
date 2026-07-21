from pathlib import Path

root = Path(__file__).resolve().parent.parent
src = root / 'src/pages/hr/CreateEmployee.jsx.new'
dst = root / 'src/pages/hr/CreateEmployee.jsx'
if src.exists():
    dst.write_text(src.read_text(encoding='utf-8'), encoding='utf-8')
    print(f'Wrote {dst}')
else:
    raise FileNotFoundError(src)
