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
        base: 'rounded-[2px] font-mono font-medium tracking-[-0.02em] transition-[color,background-color,box-shadow,transform] duration-200 active:translate-y-px',
        leadingIcon: 'opacity-80',
        trailingIcon: 'opacity-70 transition-transform duration-200 group-hover/button:translate-x-0.5'
      },
      variants: {
        variant: {
          solid: 'shadow-none ring-0',
          outline: 'bg-transparent ring-1 ring-inset ring-default hover:bg-elevated',
          soft: 'bg-primary/10 hover:bg-primary/16 active:bg-primary/20',
          subtle: 'bg-elevated/75 ring-1 ring-inset ring-default hover:bg-elevated',
          ghost: 'bg-transparent shadow-none ring-0 hover:bg-elevated/70',
          link: 'font-medium underline-offset-4 decoration-1 hover:underline'
        }
      }
    },
    badge: {
      slots: {
        base: 'rounded-[2px] font-mono font-medium tracking-[0.035em] uppercase',
        label: 'leading-none'
      }
    },
    card: {
      slots: {
        root: 'overflow-hidden rounded-[2px] bg-elevated/78 ring-0 shadow-[0_18px_50px_rgb(68_60_56_/_0.045)] divide-y divide-default/55',
        header: 'p-4 sm:px-5 bg-transparent',
        body: 'p-4 sm:p-5 bg-transparent',
        footer: 'p-4 sm:px-5 bg-transparent'
      },
      variants: {
        variant: {
          outline: {
            root: 'bg-elevated/78 ring-0 divide-y divide-default/55'
          },
          soft: {
            root: 'bg-muted/72 ring-0 divide-y divide-default/45'
          },
          subtle: {
            root: 'bg-elevated/65 ring-0 divide-y divide-default/45'
          }
        }
      }
    },
    container: {
      base: 'w-full max-w-(--ui-container) mx-auto px-5 sm:px-8 lg:px-12'
    },
    dropdownMenu: {
      slots: {
        content: 'bg-elevated/96 rounded-[2px] ring-1 ring-default shadow-xl shadow-muslin-950/10 backdrop-blur-md',
        item: 'rounded-[2px] font-mono',
        separator: 'bg-default'
      }
    },
    editor: {
      slots: {
        content: 'relative size-full flex-1 bg-muted/35 rounded-[2px] ring-1 ring-inset ring-default',
        base: [
          'w-full outline-none *:my-3 *:first:mt-0 *:last:mb-0 px-4 py-3 selection:bg-primary/20',
          '[&_p]:leading-7',
          '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4',
          '[&_a>code]:border-dashed [&_a:hover>code]:border-primary [&_a:hover>code]:text-primary',
          '[&_.mention]:text-primary [&_.mention]:font-medium',
          '[&_:is(h1,h2,h3,h4,h5,h6)]:text-highlighted [&_:is(h1,h2,h3,h4,h5,h6)]:font-display',
          '[&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl [&_h4]:text-lg [&_h5]:text-base [&_h6]:text-base',
          '[&_blockquote]:border-s [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
          '[&_[data-type=horizontalRule]]:my-8 [&_[data-type=horizontalRule]]:py-2 [&_hr]:border-t [&_hr]:border-default',
          '[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-default [&_pre]:bg-muted [&_pre]:rounded-[2px] [&_pre]:px-4 [&_pre]:py-3 [&_pre]:overflow-x-auto',
          '[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:font-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent',
          '[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:bg-muted',
          '[&_:is(ul,ol)]:ps-6 [&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented) [&_ol]:list-decimal [&_ol]:marker:text-muted [&_li]:my-1.5',
          '[&_img]:rounded-[2px] [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary',
          '[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20'
        ]
      }
    },
    formField: {
      slots: {
        label: 'font-mono text-[0.7rem] uppercase tracking-[0.08em] text-toned',
        description: 'text-muted',
        help: 'text-muted'
      }
    },
    header: {
      slots: {
        root: 'bg-elevated/78 backdrop-blur-xl border-0 shadow-[0_12px_40px_rgb(68_60_56_/_0.055)]',
        container: 'flex items-center justify-between gap-4 h-full',
        title: 'font-display text-highlighted'
      }
    },
    input: {
      slots: {
        base: 'rounded-[2px] bg-elevated/72 shadow-none font-mono text-sm'
      },
      variants: {
        variant: {
          outline: 'text-highlighted bg-elevated/72 ring-1 ring-inset ring-default focus:bg-elevated focus:ring-primary/70',
          subtle: 'text-highlighted bg-muted/80 ring-1 ring-inset ring-default',
          soft: 'text-highlighted bg-muted/80 hover:bg-elevated',
          ghost: 'text-highlighted bg-transparent hover:bg-elevated/65',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    },
    inputNumber: {
      slots: {
        base: 'rounded-[2px] bg-elevated/72 shadow-none font-mono text-sm'
      },
      variants: {
        variant: {
          outline: 'text-highlighted bg-elevated/72 ring-1 ring-inset ring-default focus:bg-elevated focus:ring-primary/70',
          subtle: 'text-highlighted bg-muted/80 ring-1 ring-inset ring-default',
          soft: 'text-highlighted bg-muted/80 hover:bg-elevated',
          ghost: 'text-highlighted bg-transparent hover:bg-elevated/65',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    },
    modal: {
      slots: {
        overlay: 'bg-muslin-950/35 backdrop-blur-sm',
        content: 'bg-elevated/96 rounded-[2px] ring-1 ring-default shadow-2xl shadow-muslin-950/20 divide-y divide-default',
        header: 'p-4 sm:px-5 min-h-(--ui-header-height)',
        body: 'p-4 sm:p-5',
        footer: 'p-4 sm:px-5'
      }
    },
    navigationMenu: {
      slots: {
        link: 'rounded-[2px] font-mono text-xs tracking-[-0.02em] before:rounded-[2px]',
        viewport: 'bg-elevated/96 rounded-[2px] ring-1 ring-default shadow-xl shadow-muslin-950/10',
        arrow: 'border-default bg-elevated'
      },
      variants: {
        active: {
          true: {
            link: 'text-highlighted before:bg-primary/10',
            linkLeadingIcon: 'text-primary'
          },
          false: {
            link: 'text-muted hover:text-highlighted hover:before:bg-elevated',
            linkLeadingIcon: 'text-dimmed group-hover:text-primary'
          }
        }
      }
    },
    select: {
      slots: {
        base: 'rounded-[2px] bg-elevated/72 shadow-none font-mono text-sm',
        content: 'bg-elevated/96 rounded-[2px] ring-1 ring-default shadow-xl shadow-muslin-950/10 backdrop-blur-md',
        item: 'rounded-[2px] font-mono'
      },
      variants: {
        variant: {
          outline: 'text-highlighted bg-elevated/72 ring-1 ring-inset ring-default focus:bg-elevated focus:ring-primary/70',
          subtle: 'text-highlighted bg-muted/80 ring-1 ring-inset ring-default',
          soft: 'text-highlighted bg-muted/80 hover:bg-elevated',
          ghost: 'text-highlighted bg-transparent hover:bg-elevated/65',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    },
    selectMenu: {
      slots: {
        content: 'bg-elevated/96 rounded-[2px] ring-1 ring-default shadow-xl shadow-muslin-950/10 backdrop-blur-md',
        input: 'border-b border-default',
        item: 'rounded-[2px] font-mono'
      }
    },
    textarea: {
      slots: {
        base: 'rounded-[2px] bg-elevated/72 shadow-none'
      },
      variants: {
        variant: {
          outline: 'text-highlighted bg-elevated/72 ring-1 ring-inset ring-default focus:bg-elevated focus:ring-primary/70',
          subtle: 'text-highlighted bg-muted/80 ring-1 ring-inset ring-default',
          soft: 'text-highlighted bg-muted/80 hover:bg-elevated',
          ghost: 'text-highlighted bg-transparent hover:bg-elevated/65',
          none: 'text-highlighted bg-transparent focus:outline-none'
        }
      }
    }
  }
})
