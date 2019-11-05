const sharp = require('sharp');

const { lstatSync, readdirSync, existsSync, mkdirSync } = require('fs');
const { join, extname, basename } = require('path');

const acceptedImageTypes = ['.jpg', '.jpeg', '.png'];

const readDirectory = source => readdirSync(source).map(name => join(source, name));
const isDirectory = source => lstatSync(source).isDirectory();
const isFile = source => lstatSync(source).isFile();
const isImage = source => acceptedImageTypes.includes(extname(source));
const getOutput = source => source.replace('input', 'output');
const addPrefix = source => source.replace(extname(source), `_thumb${extname(source)}`);

const generateThumbnail = source => {
	sharp(source)
		.resize({ height: 220, width: 220, fit: 'cover' })
		.toFile(getOutput(addPrefix(source)));
}

const fetchDirectory = source => {
	if (!existsSync(getOutput(source)))
		mkdirSync(getOutput(source));

	readDirectory(source).forEach(n => {
		if (isDirectory(n))
			fetchDirectory(n);

		if (isFile(n) && isImage(n))
			generateThumbnail(n);
	});
}

(() => {
	fetchDirectory('./input');
})();
