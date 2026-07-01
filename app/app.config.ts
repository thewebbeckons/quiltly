export default defineAppConfig({
  ui: {
    colors: {
      primary: 'calico',
      secondary: 'meadow',
      success: 'meadow',
      info: 'sky',
      warning: 'marigold',
      error: 'rosewood',
      neutral: 'muslin'
    },
    button: {
      slots: {
        base: 'rounded-lg font-semibold shadow-sm shadow-muslin-900/5 ring-offset-bg',
        leadingIcon: 'opacity-90',
        trailingIcon: 'opacity-80'
      },
      variants: {
        variant: {
          solid: 'shadow-calico-700/10',
          outline: 'bg-white/65 dark:bg-muslin-900/55',
          soft: 'bg-primary/12 hover:bg-primary/18 active:bg-primary/20',
          subtle: 'bg-white/75 dark:bg-muslin-900/65',
          ghost: 'bg-transparent shadow-none ring-0 hover:bg-muslin-100/70 dark:hover:bg-muslin-800/85',
          link: 'font-semibold underline-offset-4 hover:underline'
        }
      }
    },
    badge: {
      slots: {
        base: 'rounded-md font-semibold ring-offset-bg',
        label: 'capitalize'
      }
    },
    card: {
      slots: {
        root: 'overflow-hidden rounded-xl bg-white dark:bg-muslin-900 ring-1 ring-inset ring-black/5 dark:ring-white/10 shadow-[0_1px_2px_rgb(32_27_22_/_0.08),0_8px_24px_rgb(32_27_22_/_0.06)] dark:shadow-black/20 divide-y-0',
        header: 'p-4 sm:px-5 bg-transparent',
        body: 'p-4 sm:p-5 bg-transparent',
        footer: 'p-4 sm:px-5 bg-transparent'
      },
      variants: {
        variant: {
          outline: {
            root: 'bg-white dark:bg-muslin-900 ring-1 ring-inset ring-black/5 dark:ring-white/10 divide-y-0'
          },
          soft: {
            root: 'bg-white dark:bg-muslin-900 divide-y-0'
          },
          subtle: {
            root: 'bg-white dark:bg-muslin-900 ring-1 ring-inset ring-black/5 dark:ring-white/10 divide-y-0'
          }
        }
      }
    },
    container: {
      base: 'w-full max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8'
    },
    dropdownMenu: {
      slots: {
        content:
          'bg-white/95 dark:bg-muslin-900/95 rounded-lg ring ring-muslin-200/80 dark:ring-muslin-700/70 shadow-lg shadow-muslin-900/10 backdrop-blur-md',
        item: 'rounded-md',
        separator: 'bg-muslin-200/80 dark:bg-muslin-700/70'
      }
    },
    editor: {
      slots: {
        content:
          'relative size-full flex-1 bg-muted/25 dark:bg-elevated/30 rounded-md ring-1 ring-inset ring-muted/40 dark:ring-muted/30',
        base: [
          'w-full outline-none *:my-3 *:first:mt-0 *:last:mb-0 px-3.5 sm:px-4 py-3 selection:bg-primary/20',
          '[&_p]:leading-7',
          '[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium',
          '[&_a]:transition-colors',
          '[&_a>code]:border-dashed [&_a:hover>code]:border-primary [&_a:hover>code]:text-primary',
          '[&_a>code]:transition-colors',
          '[&_.mention]:text-primary [&_.mention]:font-medium',
          '[&_:is(h1,h2,h3,h4,h5,h6)]:text-highlighted [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold',
          '[&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h4]:text-lg [&_h5]:text-base [&_h6]:text-base',
          '[&_:is(h1,h2,h3,h4,h5,h6)>code]:border-dashed [&_:is(h1,h2,h3,h4,h5,h6)>code]:font-bold',
          '[&_h2>code]:text-xl/6 [&_h3>code]:text-lg/5',
          '[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
          '[&_[data-type=horizontalRule]]:my-8 [&_[data-type=horizontalRule]]:py-2 [&_hr]:border-t [&_hr]:border-default',
          '[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto',
          '[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:font-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent',
          '[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted',
          '[&_:is(ul,ol)]:ps-6 [&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented) [&_ol]:list-decimal [&_ol]:marker:text-muted [&_li]:my-1.5 [&_li]:ps-1.5',
          '[&_img]:rounded-md [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary',
          '[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20'
        ]
      }
    },
    formField: {
      slots: {
        label: 'font-semibold text-toned',
        description: 'text-muted',
        help: 'text-muted'
      }
    },
    header: {
      slots: {
        root: 'bg-default/78 backdrop-blur-md border-b border-muslin-200/80 dark:border-muslin-700/70',
        container: 'flex items-center justify-between gap-3 h-full',
        title: 'font-semibold text-highlighted'
      }
    },
    input: {
      slots: {
        base: 'rounded-lg bg-white/78 dark:bg-muslin-900/70 shadow-sm shadow-muslin-900/4'
      },
      variants: {
        variant: {
          outline:
            'text-highlighted bg-white/78 dark:bg-muslin-900/70 ring ring-inset ring-muslin-200/90 dark:ring-muslin-700/80 focus:bg-white dark:focus:bg-muslin-900 focus:ring-primary/70',
          subtle:
            'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 ring ring-inset ring-muslin-200/80 dark:ring-muslin-700/70',
          soft: 'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 hover:bg-white/85 dark:hover:bg-muslin-800',
          ghost:
            'text-highlighted bg-transparent hover:bg-white/60 dark:hover:bg-muslin-800/70',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    },
    inputNumber: {
      slots: {
        base: 'rounded-lg bg-white/78 dark:bg-muslin-900/70 shadow-sm shadow-muslin-900/4'
      },
      variants: {
        variant: {
          outline:
            'text-highlighted bg-white/78 dark:bg-muslin-900/70 ring ring-inset ring-muslin-200/90 dark:ring-muslin-700/80 focus:bg-white dark:focus:bg-muslin-900 focus:ring-primary/70',
          subtle:
            'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 ring ring-inset ring-muslin-200/80 dark:ring-muslin-700/70',
          soft: 'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 hover:bg-white/85 dark:hover:bg-muslin-800',
          ghost:
            'text-highlighted bg-transparent hover:bg-white/60 dark:hover:bg-muslin-800/70',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    },
    modal: {
      slots: {
        overlay: 'bg-muslin-950/30 dark:bg-muslin-950/70 backdrop-blur-sm',
        content:
          'bg-white/95 dark:bg-muslin-900/95 rounded-lg ring ring-muslin-200/80 dark:ring-muslin-700/75 shadow-xl shadow-muslin-950/15 divide-y divide-muslin-200/75 dark:divide-muslin-700/65',
        header: 'p-4 sm:px-5 min-h-(--ui-header-height)',
        body: 'p-4 sm:p-5',
        footer: 'p-4 sm:px-5'
      }
    },
    navigationMenu: {
      slots: {
        link: 'rounded-lg before:rounded-lg',
        viewport:
          'bg-white/95 dark:bg-muslin-900/95 rounded-lg ring ring-muslin-200/80 dark:ring-muslin-700/70 shadow-lg shadow-muslin-900/10',
        arrow:
          'border-muslin-200 dark:border-muslin-700 bg-white dark:bg-muslin-900'
      },
      variants: {
        active: {
          true: {
            link: 'text-primary before:bg-primary/12',
            linkLeadingIcon: 'text-primary'
          },
          false: {
            link: 'text-muted hover:text-highlighted hover:before:bg-white/65 dark:hover:before:bg-muslin-800/70',
            linkLeadingIcon: 'text-dimmed group-hover:text-primary'
          }
        }
      }
    },
    select: {
      slots: {
        base: 'rounded-lg bg-white/78 dark:bg-muslin-900/70 shadow-sm shadow-muslin-900/4',
        content:
          'bg-white/95 dark:bg-muslin-900/95 rounded-lg ring ring-muslin-200/80 dark:ring-muslin-700/70 shadow-lg shadow-muslin-900/10 backdrop-blur-md',
        item: 'rounded-md'
      },
      variants: {
        variant: {
          outline:
            'text-highlighted bg-white/78 dark:bg-muslin-900/70 ring ring-inset ring-muslin-200/90 dark:ring-muslin-700/80 focus:bg-white dark:focus:bg-muslin-900 focus:ring-primary/70',
          subtle:
            'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 ring ring-inset ring-muslin-200/80 dark:ring-muslin-700/70',
          soft: 'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 hover:bg-white/85 dark:hover:bg-muslin-800',
          ghost:
            'text-highlighted bg-transparent hover:bg-white/60 dark:hover:bg-muslin-800/70',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    },
    selectMenu: {
      slots: {
        content:
          'bg-white/95 dark:bg-muslin-900/95 rounded-lg ring ring-muslin-200/80 dark:ring-muslin-700/70 shadow-lg shadow-muslin-900/10 backdrop-blur-md',
        input: 'border-b border-muslin-200/80 dark:border-muslin-700/70',
        item: 'rounded-md'
      }
    },
    textarea: {
      slots: {
        base: 'rounded-lg bg-white/78 dark:bg-muslin-900/70 shadow-sm shadow-muslin-900/4'
      },
      variants: {
        variant: {
          outline:
            'text-highlighted bg-white/78 dark:bg-muslin-900/70 ring ring-inset ring-muslin-200/90 dark:ring-muslin-700/80 focus:bg-white dark:focus:bg-muslin-900 focus:ring-primary/70',
          subtle:
            'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 ring ring-inset ring-muslin-200/80 dark:ring-muslin-700/70',
          soft: 'text-highlighted bg-muslin-50/80 dark:bg-muslin-800/70 hover:bg-white/85 dark:hover:bg-muslin-800',
          ghost:
            'text-highlighted bg-transparent hover:bg-white/60 dark:hover:bg-muslin-800/70',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    }
  }
})
