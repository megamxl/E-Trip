import colors from 'vuetify/es5/util/colors'

export default {
  buildDir:'public',

  serverMiddleware: ['~/api/routeEndpoint.js', "~/api/carDataEnpoint.js" ,"~/api/chargerEndpoint.js"],

  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s-E-Trip',
    title: 'E-Trip',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/tab-icon.png' },
      // { rel: 'stylesheet', type: 'text/css', href: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/firebase',
  ],router: {
    middleware: ['auth']
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/firebase',
    //'@nuxtjs/html-validator',
    'nuxt-speedkit',
    "nuxt-compress"
  ],



  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  firebase: {
    config: {
      apiKey: 'AIzaSyCUyGPZkwGRsoOEImohtCLN2Dft8BkeMy8',
      authDomain: 'etrip-70521.firebaseapp.com',
      projectId: 'etrip-70521',
      storageBucket: 'etrip-70521.appspot.com',
      messagingSenderId: '766301633901',
      appId: '1:766301633901:web:2b9b8afb4495e255d22e64',
      measurementId: 'G-BYT6BJF5MM'
    },
    services: {
      firestore: true,
      auth: {
        persistence: 'local', // default
        initialize: {
          onAuthStateChangedAction: 'onAuthStateChangedAction',
          subscribeManually: false
        },
        ssr: true
      },
    },
  },

  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: 'https://api.chargetrip.io/graphql',
        httpLinkOptions: {
          headers: {
            'x-client-id': process.env.VUE_APP_WS_API_KEY || '62335e76c351300738296e30',
          },
        },
      },
    },
  },
  htmlValidator: {
    usePrettier: false,
    failOnError: true,
    options: {
      extends: [
        'html-validate:document',
        'html-validate:recommended',
        'html-validate:standard'
      ],
      rules: {
        'svg-focusable': 'off',
        'no-unknown-elements': 'error',
        // Conflicts or not needed as we use prettier formatting
        'void-style': 'off',
        'no-trailing-whitespace': 'off',
        // Conflict with Nuxt defaults
        'require-sri': 'off',
        'attribute-boolean-style': 'off',
        'doctype-style': 'off',
        // Unreasonable rule
        'no-inline-style': 'off',
        'element-permitted-content': 'off'
      }
    }
  },
  speedkit: {

    optimizePreloads: true,

    detection: {
      performance: true,
      browserSupport: true
    },

    performanceMetrics: {
      device: {
        hardwareConcurrency: { min: 2, max: 48 },
        deviceMemory: { min: 2 }
      },
      timing: {
        fcp: 800,
        dcl: 1200
      }
    },

    fonts: [],

    pictureFormats: ['webp', 'avif', 'jpg|jpeg|png|gif'],

    componentAutoImport: false,
    componentPrefix: undefined,

    /**
     * IntersectionObserver rootMargin for Compoennts and Assets
     */
    lazyOffset: {
      component: '0%',
      asset: '0%'
    },

    loader: {
      dataUri: null,
      size: '100px',
      backgroundColor: 'grey'
    }

  },

  image: {
    screens: {
      default: 320,
      xxs: 480,
      xs: 576,
      sm: 768,
      md: 996,
      lg: 1200,
      xl: 1367,
      xxl: 1600,
      '4k': 1921
    },


    alias: {
      youtube: 'https://img.youtube.com',
      vimeo: 'https://i.vimeocdn.com',
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
