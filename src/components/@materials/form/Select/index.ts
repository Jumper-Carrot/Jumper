import { cva, type VariantProps } from 'class-variance-authority'

export { default as Select } from './Select.vue'
export { default as MultiSelect } from './MultiSelect.vue'
export { default as Combobox } from './Select.vue'

// TODO: add popoverVariants

export const selectVariants = cva(
  'justify-between gap-0 pl-3 pr-2 transition-colors',
  {
    variants: {
      variant: {
        default:
          'border border-border focus:border-primary/20 hover:bg-background',
        secondary: 'border-none bg-accent hover:bg-accent',
        error:
          'border-destructive focus-visible:border-destructive bg-destructive/5 hover:bg-destructive/5'
      },
      size: {
        lg: 'h-11 text-lg',
        default: 'h-10',
        sm: 'h-9 text-sm',
        xs: 'h-7 text-sm'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export type SelectVariants = VariantProps<typeof selectVariants>
