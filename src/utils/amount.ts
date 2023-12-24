export function AmountFormat(value: number | string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function UsAmountFormat(value: number | string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}
