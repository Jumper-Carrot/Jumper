import { cva } from 'class-variance-authority'

export { default as Field } from './Field.vue'
export { default as FieldTooltip } from './FieldTooltip.vue'

const variants = {
  default: {
    item: 'space-y-0',
    label: 'ml-1 mb-1 flex gap-1 items-center text-foreground/80',
    description: 'ml-1',
    error: 'ml-1 h-6'
  }
}

export const itemVariants = cva('', {
  variants: {
    variant: {
      default: variants.default.item
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export const labelVariants = cva('', {
  variants: {
    variant: {
      default: variants.default.label
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export const descriptionVariants = cva('', {
  variants: {
    variant: {
      default: variants.default.description
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export const errorVariants = cva('', {
  variants: {
    variant: {
      default: variants.default.error
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export type FieldVariants = {
  variant: 'default' | undefined
}
