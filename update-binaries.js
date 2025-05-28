const fs = require('node:fs');
const p = require('node:path');
const n7z = require('node-7z');
const styleText = require('node:util').styleText;

let dll = false;

if(!fs.existsSync('temporary-7z')) // Temporarily copy the binary to the root of the project folder to avoid errors during extraction
{
	const path7z = require('./index.js').path7z || p.join(__dirname, 'linux', process.arch, '7zz');
	fs.copyFileSync(path7z, 'temporary-7z');

	if(/7z\.exe$/.test(path7z)) // Only for Windows
	{
		const path = p.join(p.dirname(path7z), '7z.dll');

		if(fs.existsSync(path))
		{
			dll = true;
			fs.copyFileSync(path, '7z.dll');
		}
	}
}

const bin7z = p.join(__dirname, 'temporary-7z');
const bin7zDll = dll ? p.join(__dirname, '7z.dll') : false; // Only for Windows

const forceVersion = process.env.DOWNLOAD_7Z_VERSION || ''; // You can set this to force a version, example 24.09
const publish = process.argv.includes('--publish');
const force = process.argv.includes('--force');

const packageJson = require('./package.json');
const versionParts = packageJson.version.split('.').map(Number);

const binaries = [
	// Windows x64
	{
		name: 'Windows x64',
		regex: /7z[0-9]+-x64\.exe/,
		folder: 'win/x64',
		file: '7z-win-x64.exe',
		extract: {
			'7z.exe': '7z.exe',
			'7z.dll': '7z.dll',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Windows ia32 (x86)
	{
		name: 'Windows ia32 (x86)',
		regex: /7z[0-9]+\.exe/,
		folder: 'win/ia32',
		file: '7z-win-ia32.exe',
		extract: {
			'7z.exe': '7z.exe',
			'7z.dll': '7z.dll',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Windows arm64
	{
		name: 'Windows arm64',
		regex: /7z[0-9]+-arm64\.exe/,
		folder: 'win/arm64',
		file: '7z-win-arm64.exe',
		extract: {
			'7z.exe': '7z.exe',
			'7z.dll': '7z.dll',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Windows arm
	{
		name: 'Windows arm',
		regex: /7z[0-9]+-arm\.exe/,
		folder: 'win/arm',
		file: '7z-win-arm.exe',
		extract: {
			'7z.exe': '7z.exe',
			'7z.dll': '7z.dll',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Mac x64
	{
		name: 'Mac x64',
		regex: /7z[0-9]+-mac\.tar\.xz/,
		folder: 'mac/x64',
		file: '7z-mac.tar.xz',
		extract: {
			'7zz': '7zz',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Mac arm64 (Same file as above)
	{
		name: 'Mac arm64',
		regex: /7z[0-9]+-mac\.tar\.xz/,
		folder: 'mac/arm64',
		file: '7z-mac.tar.xz',
		extract: {
			'7zz': '7zz',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Linux x64
	{
		name: 'Linux x64',
		regex: /7z[0-9]+-linux-x64\.tar\.xz/,
		folder: 'linux/x64',
		file: '7z-linux-x64.tar.xz',
		extract: {
			'7zz': '7zz',
			'7zzs': '7zzs',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Linux ia32 (x86)
	{
		name: 'Linux ia32 (x86)',
		regex: /7z[0-9]+-linux-x86\.tar\.xz/,
		folder: 'linux/ia32',
		file: '7z-linux-ia32.tar.xz',
		extract: {
			'7zz': '7zz',
			'7zzs': '7zzs',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Linux arm64
	{
		name: 'Linux arm64',
		regex: /7z[0-9]+-linux-arm64\.tar\.xz/,
		folder: 'linux/arm64',
		file: '7z-linux-arm64.tar.xz',
		extract: {
			'7zz': '7zz',
			'7zzs': '7zzs',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
	// Linux arm
	{
		name: 'Linux arm',
		regex: /7z[0-9]+-linux-arm\.tar\.xz/,
		folder: 'linux/arm',
		file: '7z-linux-arm.tar.xz',
		extract: {
			'7zz': '7zz',
			'7zzs': '7zzs',
			'History.txt': 'History.txt',
			'License.txt': 'License.txt',
			'readme.txt': 'readme.txt',
		},
	},
];

const errors = [];

(async function() {

	const realese = await findLatestRelease(forceVersion);
	const realeseVersionParts = realese.tag_name.split('.').map(Number);

	if(publish)
	{
		fs.writeFileSync('.changeset/update-7zip-'+realese.tag_name+'.md', 'Upgrade 7zip binaries to v'+realese.tag_name);
		fs.writeFileSync('7z-version.txt', realese.tag_name); // Save the version to a file
		fs.writeFileSync('package-version.txt', realeseVersionParts[0]+'.'+realeseVersionParts[1]+'.'+(realeseVersionParts[2] ?? 0)); // Save the new package version to a file, in format 24.9.0
		console.log(''); // Add an empty line for better readability
	}

	// Abort if the release version is the same as the current version
	if(versionParts[0] === realeseVersionParts[0] && versionParts[1] === realeseVersionParts[1] && !force)
	{
		console.log(`${styleText(['bold', 'greenBright'], 'No updates available.')}`);
		console.log(`${styleText(['bold', 'cyanBright'], 'Current 7z binaries version:')} ${styleText(['bold', 'magentaBright'], realese.tag_name)}`);
		if(publish) console.log('');

		return;
	}

	console.log(`${styleText(['bold', 'cyanBright'], 'Updating 7z binaries to:')} ${styleText(['bold', 'magentaBright'], realese.tag_name)}`);
	console.log('');

	for(const binary of binaries)
	{
		let asset = false;

		// Find the asset that matches the regex
		for(const _asset of realese.assets)
		{
			if(binary.regex.test(_asset.name))
			{
				asset = _asset;
				break;
			}
		}

		if(!fs.existsSync(binary.folder)) fs.mkdirSync(binary.folder, {recursive: true}); // Create the folder if it doesn't exist
		const downloadFile = p.join(binary.folder, binary.file);

		if(asset)
		{
			console.log(styleText(['bold', 'underline', 'yellowBright'], binary.name));

			await download(asset.browser_download_url, downloadFile);

			if(binary.extract)
			{
				const files = [];
				const folder = binary.folder;

				// Delete old files
				for(const file in binary.extract)
				{
					files.push(file);

					const path = p.join(folder, binary.extract[file]);

					if(fs.existsSync(path)) // Delete old file
						fs.promises.unlink(path);
				}

				await extract(downloadFile, files, folder); // Extract the selected files
				await fs.promises.unlink(downloadFile); // Delete downloaded file after extracting binaries from it

				for(const file in binary.extract)
				{
					const extracted = p.join(folder, file);
					const path = p.join(folder, binary.extract[file]);

					if(fs.existsSync(extracted))
					{
						fs.renameSync(extracted, path); // Rename extracted file (Probably to the same name)
						console.log(`${styleText(['bold', 'greenBright'], 'Extracted:')} ${file} > ${path}`);
					}
					else
					{
						const error = `${styleText(['bold', 'redBright'], 'Fail extraction:')} ${file} > ${path}`;

						errors.push(error);
						console.log(error);
					}
				}
			}

		}
		else
		{
			const error = `${styleText(['bold', 'redBright'], 'No match for:')} ${downloadFile}`;

			errors.push(error);
			console.log(error);
		}

		console.log('');
	}

	await fs.promises.unlink(bin7z); // Delete the binary copy
	if(bin7zDll) await fs.promises.unlink(bin7zDll); // Delete the dll copy

	if(errors.length)
		throw new Error(`${styleText(['bold', 'redBright'], 'Errors during download or extraction:')} \n${errors.join('\n')}`);
	else
		console.log(`${styleText(['bold', 'greenBright'], 'All binaries updated successfully!')}`);

	if(publish) console.log('');

})();

async function findLatestRelease(force = false)
{
	const response = await fetch('https://api.github.com/repos/ip7z/7zip/releases', {});
	const json = await response.json();

	if(!response.ok)
		throw new Error(`${styleText(['bold', 'redBright'], 'Error fetching releases:')} ${response.statusText}`);

	let latestRelease = false;

	for(const key in json)
	{
		const release = json[key];

		if((!release.draft && !release.prerelease) && (!force || force === release.tag_name))
		{
			latestRelease = release;
			break;
		}
	}

	return latestRelease;
}

async function download(url, destination)
{
	const response = await fetch(url);

	if(!response.ok)
	{
		const error = `${styleText(['bold', 'redBright'], 'Fail download:')} ${url} > ${destination} | ${response.statusText}`;

		errors.push(error);
		console.log(error);

		return;
	}

	await fs.promises.writeFile(destination, new Uint8Array(await response.arrayBuffer()))
	console.log(`${styleText(['bold', 'blueBright'], 'Download:')} ${url} > ${destination}`);

	return;
}

async function extract(zip, files, destination)
{
	if(/tar\.[a-z]+$/.test(zip)) // Extract the tar first
	{
		const file = await new Promise(function(resolve, reject) {

			n7z.list(zip, {$bin: bin7z, charset: 'UTF-8', listFileCharset: 'UTF-8'}).on('data', function(data) {

				if(data.file)
					resolve(data.file);

			});

		});

		await _extract(zip, [file], destination); // Extract the tar file
		zip = p.join(destination, file);

		await _extract(zip, files, destination);
		await fs.promises.unlink(zip); // Delete the tar file
	}
	else
	{
		await _extract(zip, files, destination);
	}
}

async function _extract(zip, files, destination)
{
	return new Promise(function(resolve, reject) {

		const stream = n7z.extractFull(zip, destination, {
			$bin: bin7z,
			$cherryPick: [files],
			charset: 'UTF-8',
			listFileCharset: 'UTF-8',
		});

		stream.on('end', function() {
			resolve();
		});

		stream.on('error', function(err) {
			reject(err);
		});

	});
}