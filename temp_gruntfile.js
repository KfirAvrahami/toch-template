'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    settings: {
      upload: {
        // --- Fill in after transfer ---
        hostname: 'PLACEHOLDER',           // SAP Gateway host (e.g. https://your-sap-host.company.com)
        username: 'PLACEHOLDER',           // SAP user — override at runtime via --user
        password: 'PLACEHOLDER',           // SAP password — override at runtime via --pass
        bsp_application: 'PLACEHOLDER',    // BSP container name
        bsp_application_description: 'PLACEHOLDER',
        package: 'PLACEHOLDER',            // SAP transport package
        change_request_id: 'PLACEHOLDER'   // Transport request number — override at runtime via --tr
      }
    },

    nwabap_ui5uploader: {
      options: {
        conn: {
          server: '<%= settings.upload.hostname %>',
          useStringSSL: false
        },
        auth: {
          user: '<%= settings.upload.username %>',
          pwd: '<%= settings.upload.password %>'
        }
      },
      upload_build: {
        options: {
          ui5: {
            package: '<%= settings.upload.package %>',
            bspcontainer: '<%= settings.upload.bsp_application %>',
            bspcontainer_text: '<%= settings.upload.bsp_application_description %>',
            transportno: '<%= settings.upload.change_request_id %>'
          },
          resource: {
            cwd: 'dist/angular-20-template/browser/he',
            src: '**/*.*'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nwabap-ui5uploader');

  grunt.registerTask('deploy', function () {
    const username = grunt.option('user');
    const password = grunt.option('pass');
    const transportRequest = grunt.option('tr');
    const bspApp = grunt.option('bspname');
    const bspDesc = grunt.option('bspdesc');
    const pkg = grunt.option('pkg');

    if (username) grunt.config.set('settings.upload.username', username);
    if (password) grunt.config.set('settings.upload.password', password);
    if (transportRequest) grunt.config.set('settings.upload.change_request_id', transportRequest);
    if (bspApp) grunt.config.set('settings.upload.bsp_application', bspApp);
    if (bspDesc) grunt.config.set('settings.upload.bsp_application_description', bspDesc);
    if (pkg) grunt.config.set('settings.upload.package', pkg);

    const requiredArgs = ['username', 'password', 'bsp_application', 'package', 'change_request_id'];
    const missing = requiredArgs.filter(
      (key) => grunt.config(`settings.upload.${key}`) === 'PLACEHOLDER'
    );

    if (missing.length > 0) {
      grunt.fail.fatal(
        `Missing required deploy arguments: ${missing.join(', ')}.\n` +
        'Usage: npm run deploy -- --user=X --pass=Y --tr=Z --bspname=A --bspdesc=B --pkg=C'
      );
    }

    grunt.task.run('nwabap_ui5uploader');
  });
};
