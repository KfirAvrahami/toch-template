module.exports = function (grunt) {
  grunt.initConfig({
    nwabap_ui5uploader: {
      options: {
        conn: {
          server: 'YOUR-SAP-SERVER',
          client: '100',
          user: grunt.option('user'),
          password: grunt.option('pass')
        },
        ui5: {
          package: '$TMP',
          bspcontainer: 'YOUR_BSP_CONTAINER',
          bspcontainer_text: 'Angular 20 Template',
          transportno: grunt.option('tr'),
          language: 'HE',
          create_transport: false
        },
        files: {
          cwd: 'dist/angular-20-template/browser/he',
          src: '**/*',
          filter: 'buildFiles'
        }
      },
      deploy: {
        options: {
          upload: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-nwabap-ui5uploader');
  grunt.registerTask('deploy', ['nwabap_ui5uploader:deploy']);
};
