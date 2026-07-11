import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  loadEnv(mode, '.', '');
  return {
    assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg'],
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: false
        },
        includeAssets: ['icons/*'],
        manifest: {
          name: 'Athena',
          short_name: 'Athena',
          lang: 'pt-BR',
          theme_color: '#00E88F',
          background_color: '#050505',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          categories: ['education', 'productivity'],
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          shortcuts: [
            {
              name: 'Estudar agora',
              url: '/questoes',
              description: 'Praticar questões e testar conhecimentos'
            },
            {
              name: 'Simulados',
              url: '/exames',
              description: 'Fazer simulados completos'
            },
            {
              name: 'Estatísticas',
              url: '/estatisticas',
              description: 'Ver seu progresso e relatórios'
            }
          ]
        },
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB limit
          manifestTransforms: [
            async (entries) => {
              const runtimeOnlyAssetPatterns = [
                /assets\/(AppRouterProvider-.*\.js|.*View-.*\.js)$/,
                /assets\/UI-.*\.js$/,
                /assets\/(.*Page-.*\.js|PoliticaPrivacidade-.*\.js|TermosDeUso-.*\.js|Sobre-.*\.js|Suporte-.*\.js|DadosPessoais-.*\.js|Credits-.*\.js)$/,
                /assets\/(.*Method-.*\.js|.*Screen-.*\.js)$/,
                /assets\/(Neural.*-.*\.js|The.*-.*\.js|AkashicRecords-.*\.js|ConceptGenesis-.*\.js|HolographicTutor-.*\.js|HiveMind-.*\.js|MatrixDownload-.*\.js|QuantumReading-.*\.js|SubliminalAudio-.*\.js)$/,
                /assets\/vendor-recharts-.*\.js$/,
                /assets\/(vendor-router-.*\.js|vendor-utils-.*\.js)$/,
                /assets\/(AthenaChat-.*\.js|AthenaSidebar-.*\.js|FloatingAIButton-.*\.js|aiService-.*\.js|athenaClient-.*\.js|useAIUI-.*\.js|ChatMarkdown-.*\.js)$/,
                /assets\/(PWAUpdatePrompt-.*\.js|PWAInstallPrompt-.*\.js|workbox-window\.prod\.es5-.*\.js)$/,
                /assets\/(legalContent-.*\.js|purify\.es-.*\.js)$/,
                /assets\/(BottomNav-.*\.js|BossBattle-.*\.js|CommandPalette-.*\.js|DevAccessPanel-.*\.js|DocumentAnalyzer-.*\.js|GlobalCelebrations-.*\.js|FocusMode-.*\.js|Onboarding-.*\.js|MarkdownContent-.*\.js)$/,
                /assets\/index\.es-.*\.js$/,
                /assets\/index-(?!Cf_).+\.js$/,
                /assets\/(AIHub-.*\.js|CyberneticImplants-.*\.js|LearningPath-.*\.js|MemoryPalace-.*\.js|OmniscienceProtocol-.*\.js|Redacao-.*\.js|SkillTree-.*\.js|SmartSchedule-.*\.js|SocraticDuel-.*\.js|TimeDilation-.*\.js|VideoSummarizer-.*\.js|useAITrailsStore-.*\.js)$/,
                /assets\/(extractDocumentText-.*\.js|extractTextFromPdf-.*\.js|historyAiDigest-.*\.js|Heatmap-.*\.js|Ranking-.*\.js)$/,
                /assets\/(YoutubePlayer-.*\.js|AuroraBackground-.*\.js|usePWAInstall-.*\.js|openRouter-.*\.js)$/,
                /assets\/index-.*\.css$/,
                /assets\/KaTeX_.*\.(woff2?|ttf)$/,
              ];

              const manifest = entries.filter(
                (entry) => !runtimeOnlyAssetPatterns.some((pattern) => pattern.test(entry.url))
              );
              return { manifest, warnings: [] };
            },
          ],
          navigateFallbackDenylist: [
            /^\/api\//,
            /^\/auth\//,
            /^\/rest\//,
            /^\/storage\//,
            /^\/.*\.[a-zA-Z0-9]+$/,
          ],
          globIgnores: [
            '**/stats.html',
            '**/questions_base*.js',
            '**/questions_extra*.js',
            '**/questions_12k*.js',
            '**/pdf.worker.min*.mjs',
            '**/pdf.worker.min*.js',
            '**/pdf-*.js',
            '**/ChatMarkdownEnhanced-*.js',
            '**/ChatMarkdownEnhanced-*.css',
            '**/jspdf*.js',
            '**/html2canvas*.js',
            '**/testAPI-*.js',
            '**/userRemoteSync-*.js',
            '**/clearClientStoresForSignOut-*.js',
            '**/AppRouterProvider-*.js',
            '**/*View-*.js',
            '**/UI-*.js',
            '**/*Page-*.js',
            '**/PoliticaPrivacidade-*.js',
            '**/TermosDeUso-*.js',
            '**/Sobre-*.js',
            '**/Suporte-*.js',
            '**/DadosPessoais-*.js',
            '**/Credits-*.js',
            '**/*Method-*.js',
            '**/*Screen-*.js',
            '**/Neural*-*.js',
            '**/The*-*.js',
            '**/AkashicRecords-*.js',
            '**/ConceptGenesis-*.js',
            '**/HolographicTutor-*.js',
            '**/HiveMind-*.js',
            '**/MatrixDownload-*.js',
            '**/QuantumReading-*.js',
            '**/SubliminalAudio-*.js',
            '**/vendor-recharts-*.js',
            '**/vendor-router-*.js',
            '**/vendor-utils-*.js',
            '**/KaTeX_*.woff',
            '**/KaTeX_*.woff2',
            '**/KaTeX_*.ttf',
            '**/AthenaChat-*.js',
            '**/AthenaSidebar-*.js',
            '**/FloatingAIButton-*.js',
            '**/aiService-*.js',
            '**/athenaClient-*.js',
            '**/useAIUI-*.js',
            '**/ChatMarkdown-*.js',
            '**/PWAUpdatePrompt-*.js',
            '**/PWAInstallPrompt-*.js',
            '**/workbox-window.prod.es5-*.js',
            '**/legalContent-*.js',
            '**/purify.es-*.js',
            '**/BottomNav-*.js',
            '**/BossBattle-*.js',
            '**/CommandPalette-*.js',
            '**/DevAccessPanel-*.js',
            '**/DocumentAnalyzer-*.js',
            '**/GlobalCelebrations-*.js',
            '**/FocusMode-*.js',
            '**/Onboarding-*.js',
            '**/MarkdownContent-*.js',
            '**/index.es-*.js',
            '**/AIHub-*.js',
            '**/CyberneticImplants-*.js',
            '**/LearningPath-*.js',
            '**/MemoryPalace-*.js',
            '**/OmniscienceProtocol-*.js',
            '**/Redacao-*.js',
            '**/SkillTree-*.js',
            '**/SmartSchedule-*.js',
            '**/SocraticDuel-*.js',
            '**/TimeDilation-*.js',
            '**/VideoSummarizer-*.js',
            '**/useAITrailsStore-*.js',
            '**/extractDocumentText-*.js',
            '**/extractTextFromPdf-*.js',
            '**/historyAiDigest-*.js',
            '**/Heatmap-*.js',
            '**/Ranking-*.js',
            '**/YoutubePlayer-*.js',
            '**/AuroraBackground-*.js',
            '**/usePWAInstall-*.js',
            '**/openRouter-*.js',
            '**/index-*.css',
          ],
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/KaTeX_.*\.(woff2?|ttf)$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'runtime-katex-fonts',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/ChatMarkdownEnhanced-.*\.(js|css)$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'runtime-markdown-enhanced',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 14, // 14 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.includes('/assets/') && /\/assets\/pdf-.*\.js$/.test(url.pathname),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'runtime-pdf-chunks',
                expiration: {
                  maxEntries: 6,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(jspdf.*\.js|html2canvas.*\.js|pdf\.worker\.min.*\.(js|mjs))$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-heavy-on-demand',
                expiration: {
                  maxEntries: 12,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/(AppRouterProvider-.*\.js|.*View-.*\.js)$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-route-chunks',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.includes('/assets/') && /\/assets\/UI-.*\.js$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-ui-chunk',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(.*Page-.*\.js|PoliticaPrivacidade-.*\.js|TermosDeUso-.*\.js|Sobre-.*\.js|Suporte-.*\.js|DadosPessoais-.*\.js|Credits-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-secondary-pages',
                expiration: {
                  maxEntries: 24,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/(.*Method-.*\.js|.*Screen-.*\.js)$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-learning-features',
                expiration: {
                  maxEntries: 32,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(Neural.*-.*\.js|The.*-.*\.js|AkashicRecords-.*\.js|ConceptGenesis-.*\.js|HolographicTutor-.*\.js|HiveMind-.*\.js|MatrixDownload-.*\.js|QuantumReading-.*\.js|SubliminalAudio-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-labs-features',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) => url.pathname.includes('/assets/') && /\/assets\/vendor-recharts-.*\.js$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-recharts-vendor',
                expiration: {
                  maxEntries: 2,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/(vendor-router-.*\.js|vendor-utils-.*\.js)$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-core-vendors',
                expiration: {
                  maxEntries: 6,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(AthenaChat-.*\.js|AthenaSidebar-.*\.js|FloatingAIButton-.*\.js|aiService-.*\.js|athenaClient-.*\.js|useAIUI-.*\.js|ChatMarkdown-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-athena-features',
                expiration: {
                  maxEntries: 16,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(PWAUpdatePrompt-.*\.js|PWAInstallPrompt-.*\.js|workbox-window\.prod\.es5-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-pwa-ui',
                expiration: {
                  maxEntries: 6,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(BottomNav-.*\.js|BossBattle-.*\.js|CommandPalette-.*\.js|DevAccessPanel-.*\.js|DocumentAnalyzer-.*\.js|GlobalCelebrations-.*\.js|FocusMode-.*\.js|Onboarding-.*\.js|MarkdownContent-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-optional-shell',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/(legalContent-.*\.js|purify\.es-.*\.js)$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-legal-content',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/index\.es-.*\.js$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-index-es-chunk',
                expiration: {
                  maxEntries: 2,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/index-(?!Cf_).+\.js$/.test(url.pathname),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-index-secondary-chunks',
                expiration: {
                  maxEntries: 6,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(AIHub-.*\.js|CyberneticImplants-.*\.js|LearningPath-.*\.js|MemoryPalace-.*\.js|OmniscienceProtocol-.*\.js|Redacao-.*\.js|SkillTree-.*\.js|SmartSchedule-.*\.js|SocraticDuel-.*\.js|TimeDilation-.*\.js|VideoSummarizer-.*\.js|useAITrailsStore-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-study-tools',
                expiration: {
                  maxEntries: 24,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(extractDocumentText-.*\.js|extractTextFromPdf-.*\.js|historyAiDigest-.*\.js|Heatmap-.*\.js|Ranking-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-analytics-docs',
                expiration: {
                  maxEntries: 12,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') &&
                /\/assets\/(YoutubePlayer-.*\.js|AuroraBackground-.*\.js|usePWAInstall-.*\.js|openRouter-.*\.js)$/.test(
                  url.pathname
                ),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'runtime-misc-optional',
                expiration: {
                  maxEntries: 12,
                  maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                },
              },
            },
            {
              urlPattern: ({ url }) =>
                url.pathname.includes('/assets/') && /\/assets\/index-.*\.css$/.test(url.pathname),
              handler: 'CacheFirst',
              options: {
                cacheName: 'runtime-core-styles',
                expiration: {
                  maxEntries: 4,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        }
      }),
      visualizer({
        filename: 'dist/stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 500, // 500kb
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-router': ['react-router-dom'],
            /** Gráficos: StatsView + ProfileView — um chunk só, fora do entry principal. */
            'vendor-recharts': ['recharts'],
            'vendor-utils': ['lucide-react', 'motion', 'zustand'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
