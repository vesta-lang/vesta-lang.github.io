---
title: "Download - Vesta"
description: "How to get Vesta: the Windows installer or building from source. There are no published binaries yet."
section: "download"
---

# Install Vesta

Vesta is in **alpha**. The source is public and can be built today; prepared
binaries will arrive with the first tagged release.

<!-- TABS:install -->
<!-- TAB:binaries Download binaries -->

<p class="notice">
<strong>In development.</strong> There are no published binaries yet, so for now
the way to try Vesta is to build it from source.
</p>

Once they exist, the packages for Windows, Linux and macOS will appear here
alongside their checksum and signature.

No binaries does not mean unusable. On Windows the project even builds its own
installer with a single command.

<p class="hero-actions"><label class="button" for="install-source">Build from source</label></p>

<!-- TAB:source Build from source -->

## 1. Dependencies

| Platform | Command |
| --- | --- |
| Debian and Ubuntu | `sudo apt install build-essential cmake libssl-dev` |
| Arch Linux | `sudo pacman -S base-devel cmake openssl` |
| macOS | `brew install cmake openssl` |
| Windows | TDM-GCC-64 (or MinGW) and CMake, plus OpenSSL |

Keystone, Capstone and LibPEparse ship as submodules and clone themselves.
Nothing else is required.

## 2. Clone and build

```bash
git clone --recursive https://github.com/vesta-lang/vesta.git
cd vesta

cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

On Windows with TDM-GCC you need to ask for the MinGW generator:

```bash
cmake -G "MinGW Makefiles" -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

With CMake 4 or newer you may need to add `-DCMAKE_POLICY_VERSION_MINIMUM=3.5`,
because one of the submodules declares a minimum older than that version
accepts.

The resulting executable is `build/vm`. Once installed it is called `vesta`.

## 3. Check that it works

```bash
./build/vm --version
```

## 4. Your first program

Save this as `hello.vx`:

<!-- SNIPPET:hello -->

Then build it, **from the repository root** (see the note on the standard
library below):

```bash
./build/vm --vx hello.vx -o hello
./build/vm --run hello.velb
```

The same source can be compiled into a standalone native executable, without the
virtual machine:

```bash
./build/vm --vx hello.vx -m aot -o hello
./hello
```

<!-- TAB:posix Install on Linux and macOS -->

<p class="notice">
<strong>There is no <code>make install</code>.</strong> Project packaging is
Windows-only today, so on Linux and macOS installing means copying files by
hand. It is four commands.
</p>

Copying the binary alone is not enough. The compiler resolves the standard
library, the native plugins and the preprocessor headers **relative to its own
location**, so they have to travel with it.

```bash
sudo mkdir -p /usr/local/lib/vesta
sudo cp build/vm            /usr/local/lib/vesta/vesta
sudo cp -r stdlib           /usr/local/lib/vesta/
sudo cp -r preprocessor/include_lib /usr/local/lib/vesta/
```

That leaves a layout which satisfies all three lookups at once:

```text
/usr/local/lib/vesta/
    vesta              the compiler
    stdlib/vx/         standard library modules
    stdlib/native/     native plugins
    include_lib/       preprocessor headers
```

And to call it from anywhere, a symbolic link:

```bash
sudo ln -s /usr/local/lib/vesta/vesta /usr/local/bin/vesta
vesta --version
```

The link works because on Linux the compiler finds out where it lives by reading
`/proc/self/exe`, which resolves the link and returns the real path.

<p class="notice">
<strong>On macOS, avoid the symbolic link.</strong> There the executable path is
obtained differently and may come back as the link itself, which would send the
compiler looking for its resources in <code>/usr/local/bin</code>. Add the
directory to your <code>PATH</code> instead:
</p>

```bash
echo 'export PATH="/usr/local/lib/vesta:$PATH"' >> ~/.zshrc
```

<!-- TAB:installer Windows installer -->

On Windows you do not have to live out of the build tree: the project builds its
own installer through CMake, and **downloads NSIS by itself** if you do not have
it.

```bash
cmake --build build --target installer
```

That produces `VestaVM-<version>-win64.exe`, which installs into Program Files,
adds Vesta to the `PATH` and creates the Start Menu shortcut.

If you would rather not install anything, there is a portable ZIP:

```bash
cmake --build build --target installer-zip
```

### Custom installation

The installer lets you pick which components you want:

| Component | What it contains |
| --- | --- |
| `core` | The compiler, the runtime and the link-time libraries. Required. |
| `stdlib` | The standard library and the native plugins. |
| `lsp` | The language server, for editors. |
| `examples` | The example programs. |
| `tools` | Project utilities. |
| `sdk` | Headers and libraries for embedding Vesta or writing plugins. |

**`stdlib` is worth keeping**: without it the compiler still runs, but any
program that imports a standard library module will fail to build.

<!-- TABS:end -->

## How the compiler finds its resources

This is the most common reason a fresh install fails, so it is worth knowing.
The compiler does not carry its resources inside: it looks for them on disk, and
**not all of them are looked up the same way**.

| Resource | What it is | Where it is searched |
| --- | --- | --- |
| `stdlib/vx` | Standard library modules | `VX_STDLIB_DIR`, then relative to the working directory, then to the executable |
| `include_lib` | VPP preprocessor headers | Relative to the executable |
| `stdlib/native` | Native plugins (I/O, math) | **Only** relative to the executable |

The last row is the surprising one: native plugins check neither the environment
variable nor the working directory. That is why copying just the binary into
`/usr/local/bin` leaves you with a compiler that starts up and then fails as
soon as a program does any input or output.

For `stdlib/vx`, the full order is:

1. The **`VX_STDLIB_DIR`** variable, if set.
2. Relative to the **working directory**: `stdlib/vx`, `../stdlib/vx` or
   `../../stdlib/vx`.
3. Relative to the **executable**: `<dir>/stdlib/vx` or `<dir>/../stdlib/vx`.

That is why the examples above run **from the repository root**: `build/vm` has
no `stdlib/` beside it, and works through the second rule. Move to another
directory and it stops working.

There is also a **`VX_PATH`** variable, shaped like `PATH`, to add directories
where your own modules are looked up.

## What to expect from an alpha

The language, the compiler, the virtual machine and the JIT work and are tested.
Some parts are under active development, and they are marked as such wherever
they appear in this documentation.

It is not recommended for production yet, and the syntax may change between
versions. If you hit a bug, the place to report it is the
[project repository](https://github.com/vesta-lang/vesta).
