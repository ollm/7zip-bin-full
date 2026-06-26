# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

<!-- VERSIONS -->

## v26.2.0 (26-06-2026)

##### Changed

- chore: upgrade 7zip binaries to v26.02
```
- Some bugs and vulnerabilities were fixed.
```

## v26.1.0 (28-04-2026)

##### Changed

- chore: upgrade 7zip binaries to v26.01
```
- linux version of 7-Zip can use huge pages (2 MB pages). It can increase compression
  speed for 10% for 7z/xz/LZMA/LZMA2 compression.
- new -spo[d|c|r] switch specifies the path generation mode for the output directory
  for archive extraction. The output directory path is generated from the path specified
  in the -o{dir_path} switch and the name of the archive being unpacked.
    -spod : for Linux/Posix/macOS: -o{dir_path} specifies the direct path to the output directory.
            The asterisk (*) character in {dir_path} will not be replaced by the archive name.
    -spoc : 7-Zip will concatenate the path specified in -o{dir_path} with the archive name
            to form the final path to the output directory.
    -spor : 7-Zip will replace asterisk (*) character in the path specified in the -o{dir_path}
            with the archive name. This is the default option.
- some bugs were fixed.
```

## v26.0.0 (18-02-2026)

##### Changed

- chore: upgrade 7zip binaries to v26.00
```
- improved code for ZIP, CPIO, RAR, UFD, QCOW, Compound.
- 7-Zip File Manager: improved sorting order of the file list. It uses file name as secondary sorting key.
- 7-Zip File Manager: improved Benchmark to support systems with more than 64 CPU threads.
- the bug was fixed: 7-Zip could not correctly extract TAR archives containing sparse files.
- some bugs were fixed.
```

## v25.1.0 (04-08-2025)

##### Changed

- chore: upgrade 7zip binaries to v25.01
```
- The code for handling symbolic links has been changed 
  to provide greater security when extracting files from archives.
  Command line switch -snld20 can be used to bypass default security 
  checks when creating symbolic links.
```

## v25.0.0 (14-07-2025)

##### Changed

- chore: upgrade 7zip binaries to v25.00
```
- 7-Zip for Windows can now use more than 64 CPU threads for compression
  to zip/7z/xz archives and for the 7-Zip benchmark.
  If there are more than one processor group in Windows (on systems with more than
  64 cpu threads), 7-Zip distributes running CPU threads across different processor groups.
- bzip2 compression speed was increased by 15-40%.
- deflate (zip/gz) compression speed was increased by 1-3%.
- improved support for zip, cpio and fat archives.
- fixed some bugs and vulnerabilities.
- the bug was fixed : CVE-2025-53816 : 7-Zip could work incorrectly for some incorrect RAR archives. 
- the bug was fixed : CVE-2025-53817 : 7-Zip could crash for some incorrect COM (Compound File) archives. 
```