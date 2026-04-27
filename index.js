const path = require('path')

function getPath(linux7zzs = false, custom7z = false)
{
	if(process.env.USE_SYSTEM_7Z === 'true')
		return '7za';

	if(process.platform === 'darwin')
	{
		return path.join(__dirname, 'mac', process.arch, (custom7z ? '7zzc' : '7zz'));
	}
	else if(process.platform === 'win32')
	{
		if(custom7z)
			return path.join(__dirname, 'win', process.arch, '7zc', '7z.exe');
		else
			return path.join(__dirname, 'win', process.arch, '7z.exe');
	}
	else
	{
		return path.join(__dirname, 'linux', process.arch, (linux7zzs ? (custom7z ? '7zzsc' : '7zzs') : (custom7z ? '7zzc' : '7zz')));
	}
}

exports.path7z = getPath();
exports.path7zc = getPath(false, true);
exports.path7zzs = getPath(true);
exports.path7zzsc = getPath(true, true);
exports.path7x = path.join(__dirname, '7x.sh');