'use strict';

/**
 * SAP BSP deployment (S/4HANA 2023 flow).
 *
 * Build first, then upload:
 *
 *   ng build
 *   grunt deploy --user=<sap-user> --pass=<sap-pass> --tr=<transport>
 *
 * Optional overrides: --bspname=<BSP app> --bspdesc=<description> --pkg=<package>.
 * Do not combine --pass with --verbose: grunt echoes the raw command-line options in verbose mode.
 * Credentials and the transport number are passed at invocation and are never committed
 * (see [BUILD-DEPLOY] in STANDARDS.md). Fill in the real SAP hostname/client on the network.
 *
 * `deploy` = `prepareDeploy` (copy the marker files into the build output) + `deployAbap`
 * (upload through ui5-nwabap-deployer-core). The marker files tell SAP how to store file types
 * it cannot classify by itself (error /UI5/UI5_REP_LOAD/072 "Type of file ... is unknown"):
 *   .Ui5RepositoryBinaryFiles — stored as MIME objects (fonts, images, ...)
 *   .Ui5RepositoryTextFiles   — stored as codepage-aware text objects
 * Add a pattern to one of them when the upload rejects a new file type.
 */
module.exports = function (grunt) {
  grunt.initConfig({
    settings: {
      upload: {
        username: '',
        password: '',
        hostname: 'https://YOUR-SAP-SERVER',
        client: '100',
        bsp_application: 'ZMYAPP',
        bsp_application_description: 'Angular 20 Template',
        package: '$TMP',
        change_request_id: ''
      }
    },

    nwabap_ui5uploader: {
      upload_build: {
        options: {
          resources: {
            cwd: 'dist/angular-20-template/browser/he',
            src: ['**/*.*', '.Ui5RepositoryBinaryFiles', '.Ui5RepositoryTextFiles']
          }
        }
      }
    }
  });

  // Registers the plugin; `deploy` below calls ui5-nwabap-deployer-core directly and only reuses
  // this plugin's `resources` config block.
  grunt.loadNpmTasks('grunt-nwabap-ui5uploader');

  // Copy the marker files from the project root into the build output, so they are uploaded too.
  grunt.registerTask('prepareDeploy', function () {
    const destDir = grunt.config.get('nwabap_ui5uploader.upload_build.options.resources.cwd');
    const markers = ['.Ui5RepositoryBinaryFiles', '.Ui5RepositoryTextFiles'];
    markers.forEach(function (name) {
      if (grunt.file.exists(name)) {
        grunt.file.write(destDir + '/' + name, grunt.file.read(name));
        grunt.log.ok('Wrote ' + name + ' to ' + destDir);
      }
    });
  });

  // Upload the build output to the SAP UI5 ABAP repository.
  grunt.registerTask('deployAbap', function () {
    const done = this.async();
    const upload = grunt.config.get('settings.upload');
    const cwd = grunt.config.get('nwabap_ui5uploader.upload_build.options.resources.cwd');
    const src = grunt.config.get('nwabap_ui5uploader.upload_build.options.resources.src');

    // `dot: true` so the dot-named marker files are included; read as binary (encoding: null).
    const files = grunt.file
      .expand({ cwd: cwd, filter: 'isFile', dot: true }, src)
      .map(function (filePath) {
        return {
          path: filePath,
          content: grunt.file.read(cwd + '/' + filePath, { encoding: null })
        };
      });

    const options = {
      conn: {
        server: upload.hostname,
        client: upload.client,
        // On-prem SAP server with a self-signed certificate.
        useStrictSSL: false
      },
      auth: { user: upload.username, pwd: upload.password },
      ui5: {
        package: upload.package,
        bspcontainer: upload.bsp_application,
        bspcontainer_text: upload.bsp_application_description,
        transportno: upload.change_request_id,
        create_transport: false,
        language: 'HE'
      }
    };

    const logger = {
      log: function (msg) {
        grunt.log.writeln(msg);
      },
      error: function (msg) {
        grunt.log.error(msg);
      },
      // The deployer logs its options (including the password) in verbose mode; mask it.
      logVerbose: function (msg) {
        grunt.verbose.writeln(String(msg).replace(/("pwd":")[^"]*"/g, '$1***"'));
      }
    };

    require('ui5-nwabap-deployer-core')
      .deployUI5toNWABAP(options, files, logger)
      .then(function () {
        grunt.log.ok('UI5 sources successfully deployed.');
        done();
      })
      .catch(function (err) {
        grunt.log.error(err);
        grunt.fail.warn('Error occurred while deploying UI5 sources.');
        done(false);
      });
  });

  // Command-line options override settings.upload.
  grunt.registerTask('deploy', function () {
    const overrides = {
      user: 'username',
      pass: 'password',
      tr: 'change_request_id',
      bspname: 'bsp_application',
      bspdesc: 'bsp_application_description',
      pkg: 'package'
    };
    Object.keys(overrides).forEach(function (option) {
      const value = grunt.option(option);
      if (value) {
        grunt.config.set('settings.upload.' + overrides[option], value);
      }
    });

    // Fail fast, before anything is uploaded, when a required setting is still missing.
    const upload = grunt.config.get('settings.upload');
    const missing = [];
    if (upload.hostname.indexOf('YOUR-SAP-SERVER') !== -1) missing.push('settings.upload.hostname');
    if (!upload.username) missing.push('--user');
    if (!upload.password) missing.push('--pass');
    if (!upload.change_request_id && upload.package !== '$TMP') missing.push('--tr');
    if (missing.length > 0) {
      grunt.fail.fatal(
        'Missing deploy settings: ' + missing.join(', ') + '\n' +
          'Usage: npm run deploy -- --user=X --pass=Y --tr=Z [--bspname=A --bspdesc=B --pkg=C]'
      );
    }

    grunt.task.run(['prepareDeploy', 'deployAbap']);
  });
};
