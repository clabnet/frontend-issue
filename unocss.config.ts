import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [['column-layout', 'flex flex-col border border-dashed p-3 my-3']],

  // theme: {
  //   colors: {
  //     primary: {
  //       // DEFAULT: themeOverrides.common.primaryColor,
  //       // lighten: themeOverrides.common.primaryColorHover,
  //       // darken: themeOverrides.common.primaryColorPressed,
  //     },
  //   },
  // },

  // theme: {
  //   colors: {
  //     primary: 'var(--primary-color)',
  //     primary_hover: 'var(--primary-color-hover)',
  //     primary_pressed: 'var(--primary-color-pressed)',
  //     primary_active: 'var(--primary-color-active)',
  //     info: 'var(--info-color)',
  //     info_hover: 'var(--info-color-hover)',
  //     info_pressed: 'var(--info-color-pressed)',
  //     info_active: 'var(--info-color-active)',
  //     success: 'var(--success-color)',
  //     success_hover: 'var(--success-color-hover)',
  //     success_pressed: 'var(--success-color-pressed)',
  //     success_active: 'var(--success-color-active)',
  //     warning: 'var(--warning-color)',
  //     warning_hover: 'var(--warning-color-hover)',
  //     warning_pressed: 'var(--warning-color-pressed)',
  //     warning_active: 'var(--warning-color-active)',
  //     error: 'var(--error-color)',
  //     error_hover: 'var(--error-color-hover)',
  //     error_pressed: 'var(--error-color-pressed)',
  //     error_active: 'var(--error-color-active)',
  //     dark: '#18181c'
  //   }
  // },

  rules: [
    [
      /^grid-layout-(\d+)(\/(\d+(.*)))?$/,
      ([, row, , gap, gapUnit]) => {
        return {
          display: 'grid',
          'grid-gap': `${gap ?? '36'}${gapUnit ? '' : 'px'}`,
          'grid-template-columns': `repeat(${row}, minmax(0, 1fr))`,
        }
      },
      { layer: 'components' },
    ],
    [
      /^flex((-(js|je|jc|jb|ja|jev|as|ae|ac|ab|ast|row|rowr|col|colr)){1,3})$/,
      ([_, keyStr]) => {
        return {
          display: 'flex',
          ...Object.fromEntries(
            keyStr
              .split('-')
              .slice(1)
              .map((item) => {
                return handleShortKeys(item)
              })
          ),
        }
      },
      { layer: 'components' },
    ],
  ],
  presets: [
    presetAttributify(),
    presetUno(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography({

      selectorName: 'markdowna', // now use like `markdown markdown-gray`, `not-markdown`
      // cssExtend is an object with CSS selector as key and
      // CSS declaration block as value like writing normal CSS.
      cssExtend: {
        'code': {
          color: '#8b5cf6',
        },
        'a:hover': {
          color: '#f43f5e',
        },
        'a:visited': {
          color: '#14b8a6',
        },
      }

    }),

    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left gap-2'.split(' '),
})

function handleShortKeys(key: string): string[] {
  const J = 'justify-content'
  const A = 'align-items'
  const D = 'flex-direction'
  switch (key) {
    case 'js':
      return [J, 'flex-start']
    case 'je':
      return [J, 'flex-end']
    case 'jc':
      return [J, 'center']
    case 'jb':
      return [J, 'space-between']
    case 'ja':
      return [J, 'space-around']
    case 'jev':
      return [J, 'space-evenly']
    case 'as':
      return [A, 'flex-start']
    case 'ae':
      return [A, 'flex-end']
    case 'ac':
      return [A, 'center']
    case 'ab':
      return [A, 'baseline']
    case 'ast':
      return [A, 'stretch']
    case 'row':
      return [D, 'row']
    case 'rowr':
      return [D, 'row-reverse']
    case 'col':
      return [D, 'column']
    case 'colr':
      return [D, 'column-reverse']
    default:
      return []
  }
}
