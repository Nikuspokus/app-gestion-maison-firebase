
<template>
  <div>
    <input type="file" accept="image/*" @change="onChange" />
    <div v-if="preview" class="mt-2">
      <img :src="preview" class="h-32 rounded object-cover" />
    </div>
  </div>
</template>

<script setup lang="ts">
const modelValue = defineModel<File | null>({ default: null })
const preview = ref<string | null>(null)

function onChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files ? input.files[0] : null
  if (!file) return
  compressImage(file, 1280, 0.8).then(f => {
    modelValue.value = f
    const reader = new FileReader()
    reader.onload = () => preview.value = reader.result as string
    reader.readAsDataURL(f)
  })
}

function compressImage(file: File, maxSize: number, quality: number): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp'), { type: 'image/webp' }))
      }, 'image/webp', quality)
    }
    img.src = URL.createObjectURL(file)
  })
}
</script>
