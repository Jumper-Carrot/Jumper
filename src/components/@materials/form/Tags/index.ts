import { cva, type VariantProps } from 'class-variance-authority'

export { default as Tags } from './Tags.vue'

export const tagsVariants = cva('rounded-lg bg-background', {
  variants: {
    variant: {
      default: 'border border-border focus:border-primary/20',
      secondary: 'border-none bg-accent',
      error:
        'border-destructive focus-visible:border-destructive bg-destructive/5'
    },
    size: {
      lg: 'min-h-11 ps-12 text-lg py-1 gap-0',
      default: 'min-h-10 ps-10 text-md py-1',
      sm: 'min-h-9 ps-8 text-sm py-1 gap-y-1',
      xs: 'min-h-7 ps-7 text-xs py-0 gap-1'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})
export const tagVariants = cva(
  'rounded-md bg-background flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-accent border-accent/20',
        secondary: 'border-none bg-background',
        error: 'bg-accent bg-background'
      },
      size: {
        lg: 'h-7 *:text-lg',
        default: 'h-7 *:text-md',
        sm: 'h-6 text-sm',
        xs: 'h-5 *:text-xs'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
export const tagIconVariants = cva('absolute inset-y-0 start-0 flex h-full', {
  variants: {
    variant: {
      default: 'text-muted-foreground text-slate-400',
      secondary: 'text-muted-foreground text-slate-400',
      error: 'text-muted-foreground text-destructive'
    },
    size: {
      lg: 'ps-3 *:size-7 pt-2',
      default: 'ps-2 *:size-6 pt-2',
      sm: 'ps-2 *:size-5 pt-2',
      xs: 'ps-2 *:size-4 pt-1.5'
    }
  },
  defaultVariants: {
    variant: 'default',
    size: 'default'
  }
})
export type TagsVariants = VariantProps<typeof tagsVariants> &
  VariantProps<typeof tagVariants> &
  VariantProps<typeof tagIconVariants>
