import { defineShard } from 'anthelion';
import { getLatestRelease } from 'anthelion/github';
import { match } from 'anthelion/helpers';

// Git for Windows tags releases as 2.55.0.windows.5, but the package version
// is 2.55.0.5. Later rebuilds, such as .windows.2, become 2.55.0.2.
export default defineShard(async () => {
	const release = await getLatestRelease({
		owner: 'git-for-windows',
		repo: 'git',
	});

	const {
		groups: [baseVersion, buildNumber],
	} = match(release.tag, /^(\d+(?:\.\d+)+)\.windows\.(\d+)$/);
	const version = buildNumber === '1' ? baseVersion : `${baseVersion}.${buildNumber}`;

	const urls = () => release.urls().filter((url) => /\/PortableGit-[^/]+\.7z\.exe$/.test(url));

	return {
		version,
		urls,
	};
});
