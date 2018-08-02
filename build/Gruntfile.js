/*
 * (c) Copyright Ascensio System SIA 2010-2018
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia,
 * EU, LV-1021.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */


/*
	This is LawGeex version of the Grunt file.
	It builds only word sdk without uglyfing the code
	The original grunt file is saved under Gruntfile.js.orig
*/

module.exports = function (grunt) {
	var defaultConfig, packageFile;
	var path = grunt.option('src') || './configs';

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-split-file');

	grunt.registerTask('build_webword_init', 'Initialize build WebWord SDK.', function () {
		defaultConfig = path + '/webword.json';
		packageFile = require(defaultConfig);

		if (packageFile)
			grunt.log.ok('WebWord config loaded successfully'.green);
		else
			grunt.log.error().writeln('Could not load config file'.red);
	});

	grunt.registerTask('build_word', ['build_webword_init', 'build_sdk']);

	grunt.registerTask('concat_sdk_init', function () {
		var sdkDstFolder = packageFile['compile']['sdk']['dst'];
		var sdkAllDestFile = sdkDstFolder + '/sdk-all.js';
		var sdkAllMinDestFile = sdkDstFolder + '/sdk-all-min.js';
		var srcFilesMin = packageFile['compile']['sdk']['min'];
		var srcFilesAll = packageFile['compile']['sdk']['common'];
		var sdkOpt = {};

		if (!grunt.option('noclosure')) {
			sdkOpt = {
				banner: '(function(window, undefined) {',
				footer: '})(window);'
			};
		}

		if (!grunt.option('noprivate')) {
			srcFilesAll = srcFilesAll.concat(packageFile['compile']['sdk']['private']);
		}

		grunt.initConfig({
			concat: {
				sdkmin: {
					options: {
						banner: '',
						footer: 'window["split"]="split";'
					},
					src: srcFilesMin,
					dest: sdkAllMinDestFile
				},
				sdk: {
					options: sdkOpt,
					src: srcFilesAll,
					dest: sdkAllDestFile
				}
			}
		});
	});

	grunt.registerTask('concat_sdk', ['concat_sdk_init', 'concat']);
	grunt.registerTask('build_sdk', ['concat_sdk']);
	grunt.registerTask('default', ['build_word']);
};
