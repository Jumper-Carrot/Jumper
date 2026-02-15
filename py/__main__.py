import importlib.util
import sys
import json
import inspect
from pathlib import Path


class Unbuffered(object):
    def __init__(self, stream, prefix=""):
        self.stream = stream
        self.prefix = prefix

    def write(self, data):
        if self.prefix and data.strip():
            for line in data.splitlines(True):
                if line.strip():
                    self.stream.write(self.prefix + line)
                else:
                    self.stream.write(line)
        else:
            self.stream.write(data)
        self.stream.flush()

    def writelines(self, datas):
        if self.prefix:
            for line in datas:
                if line.strip():
                    self.stream.write(self.prefix + line)
                else:
                    self.stream.write(line)
        else:
            self.stream.writelines(datas)
        self.stream.flush()

    def __getattr__(self, attr):
        return getattr(self.stream, attr)


sys.stdout = Unbuffered(sys.stdout)
sys.stderr = Unbuffered(sys.stdout, prefix="[STDERR] ")

script_path = Path(sys.argv[2]).resolve()
module_name = script_path.stem

spec = importlib.util.spec_from_file_location(module_name, script_path)
module = importlib.util.module_from_spec(spec)
sys.modules[module_name] = module
spec.loader.exec_module(module)

flag = sys.argv[1]
func = None
if flag == "-r":
    func = "run"
elif flag == "-o":
    func = "get_options"
else:
    raise ValueError("Invalid flag. Use -r for run or -o for get_options.")

context = json.loads(sys.argv[3]) if len(sys.argv) > 3 else None

if hasattr(module, func):
    module_func = getattr(module, func)
    if callable(module_func):
        sig = inspect.signature(module_func)
        result = None
        if len(sig.parameters) > 0:
            result = module_func(context)
        else:
            result = module_func()
        if flag == "-o":
            print(f"{context['id']} - options {json.dumps(result)}")
    else:
        raise TypeError(f"{func} is not callable.")
else:
    raise AttributeError(f"Python script does not have a '{func}' function.")
