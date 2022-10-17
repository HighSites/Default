import childProcess from 'child_process';
import configGH from '../configs/_!GH.js';
import fs from 'fs';
import del from 'del';
import path from 'path';

const runCmd = (command, dir = '') => {
	console.log('\x1b[36m%s\x1b[0m', `running '${command}' at '${dir}'`);
	childProcess.execSync(command, {
		cwd: process.cwd() + (dir[0] == '.' ? dir.slice(1) : dir),
	},
		(error, stdout, stderr) => {
			recOut = stderr;
			if (error) {
				console.error('\x1b[31m', `[${command}] exec error:\n ${error}`);
				return;
			}
			if (stdout) {
				console.log(`[${command}] stdout:\n ${stdout}`);
			}
			if (stderr)
				console.error('\x1b[33m', `[${command}] stderr:\n ${stderr}`);
		});
	return;
};



const deploying = (cb) => {
	del.sync([`${configGH.dest}/**`, `!${configGH.dest}`]);

	runCmd(`cp -r ${$.path.root} ${configGH.dest}`);

	if (configGH.mode > 1)
		runCmd(`cp -r ${$.path.from} ${configGH.dest}`);

	if (configGH.mode > 2) {
		runCmd(`cp -r ./gulp ${configGH.dest}`);
		runCmd(`cp gulpfile.js ${configGH.dest}/gulp`);
		runCmd(`cp package.json ${configGH.dest}/gulp`);
	}

	const comment = configGH.whatsNew ? configGH.whatsNew : 'Gulp: uploading files';
	var name = $.path.rootName;
	runCmd(`echo ${configGH.token} > a.txt`, configGH.dest);
	runCmd(`gh auth login --with-token < a.txt`, configGH.dest);
	runCmd(`gh repo list > a.txt`, configGH.dest);
	var cmdOut = fs.readFileSync(`${configGH.dest}/a.txt`, 'utf8');
	if (!cmdOut.includes(name)) {
		console.log('\x1b[32m%s\x1b[0m', `there is no repository with name '${name}' - creating one`);
		runCmd(`gh repo create ${name} --public 2> link.txt`, configGH.dest);
	} else console.log('\x1b[32m%s\x1b[0m', `repository '${name}' already exists`);
	runCmd(`rm a.txt`, configGH.dest);

	runCmd(`gh repo view ${name} > a.txt`);
	cmdOut = fs.readFileSync(`a.txt`, 'utf8');
	const start = cmdOut.indexOf('name:') + 'name:'.length + 1;
	const end = () => {
		let from = 0;
		while (cmdOut.indexOf('\n', from) < start)
			from++;
		return cmdOut.indexOf('\n', from);
	}
	const repoName = cmdOut.slice(start, end());
	runCmd(`rm a.txt`);

	const pushing = (folder = '', branch) => {
		let pathTo = configGH.dest + folder.slice(folder.indexOf('.') + 1);
		runCmd(`git init`, pathTo);
		runCmd(`git add .`, pathTo);
		runCmd(`git branch -m ${branch}`, pathTo);
		runCmd(`git commit -m '${comment}'`, pathTo);
		runCmd(`git remote add origin https://github.com/${repoName}.git`, pathTo)
		runCmd(`git push -u origin ${branch}`, pathTo);
		return;
	}

	let pos;
	let pathRoot = $.path.root;
	while ((pos = pathRoot.indexOf('/')) > 0)
		pathRoot = pathRoot.slice(pos + 1);
	pathRoot = '/' + pathRoot;
	
	pushing(pathRoot, 'gh_pages');

	if (configGH.mode > 1)
		pushing($.path.from, 'src');

	if (configGH.mode > 2)
		pushing('./gulp', 'gulp');

	cb();
	return;
}

export default deploying;