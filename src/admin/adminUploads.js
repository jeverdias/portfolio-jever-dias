export const readAsDataUrl = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'))
  reader.readAsDataURL(file)
})

export function validateLocalImageSize(file, maximumBytes, message) {
  if (file.size <= maximumBytes) return
  throw new Error(message)
}
