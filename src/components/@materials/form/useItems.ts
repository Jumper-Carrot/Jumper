import { type MaybeRefOrGetter, toRef } from 'vue'

export const useItems = <T, U>(
  items: MaybeRefOrGetter<T[]>,
  itemKey?: MaybeRefOrGetter<keyof T | ((item: T) => U) | undefined>,
  label?: MaybeRefOrGetter<keyof T | ((item: T) => string) | undefined>
) => {
  const itemsRef = toRef(items)
  const itemKeyRef = toRef(itemKey)
  const labelRef = toRef(label)

  const getItemKey = (item: T): U => {
    if (!itemKeyRef.value) {
      return item as unknown as U
    }
    if (typeof itemKeyRef.value === 'function') {
      return itemKeyRef.value(item)
    }
    return item[itemKeyRef.value as keyof T] as U
  }

  const getItemLabel = (item: T | null): string => {
    if (!item) {
      return ''
    }
    if (!labelRef.value) {
      return typeof item === 'string' ? item : JSON.stringify(item)
    }
    if (typeof labelRef.value === 'function') {
      return labelRef.value(item)
    }
    return item[labelRef.value as keyof T] as string
  }

  const getItem = (key: U): T | null => {
    let normalizedKey: any =
      typeof key === 'string' && !isNaN(Number(key)) ? Number(key) : key
    return (
      (itemsRef.value.find(
        item =>
          JSON.stringify(getItemKey(item as T)) == JSON.stringify(normalizedKey)
      ) as T) ?? null
    )
  }

  const getLabelFromKey = (key: U): string | undefined =>
    getItemLabel(getItem(key))

  return {
    getItem,
    getItemKey,
    getItemLabel,
    getLabelFromKey
  }
}
