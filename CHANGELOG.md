# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

<!-- VERSIONS -->

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