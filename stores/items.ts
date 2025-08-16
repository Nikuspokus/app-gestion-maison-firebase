import { defineStore } from 'pinia'
import {
  getFirestore, collection, query, orderBy, onSnapshot,
  addDoc, doc, deleteDoc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import {
  deleteObject, getStorage, ref as sref, uploadBytes, getDownloadURL
} from 'firebase/storage'
import { getApp } from 'firebase/app'
import type { Item, Unit } from '@/types'
import { useAuth } from '@/composables/useAuth'

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])
  let unsubs: Array<() => void> = []

  function bind() {
    unbind()
    const app = getApp()
    const db = getFirestore(app)
    const { user, familyId } = useAuth()
    if (!user.value) return

    const qItems = query(
      collection(db, 'families', familyId.value!, 'items'),
      orderBy('updatedAt', 'desc')
    )

    const unsub = onSnapshot(qItems, (snap) => {
      items.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
    })
    unsubs.push(unsub)
  }

  function unbind() {
    unsubs.forEach((u) => u())
    unsubs = []
  }

  async function add(payload: { name: string; quantity: number; unit: Unit; file?: File }) {
    const app = getApp()
    const db = getFirestore(app)
    const st = getStorage(app)
    const { user, familyId } = useAuth()

    const base: any = {
      name: payload.name,
      quantity: payload.quantity,
      unit: payload.unit,
      ownerUid: user.value!.uid,
      familyId: familyId.value!,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }

    // 1) créer le doc sans image
    const col = collection(db, 'families', familyId.value!, 'items')
    const docRef = await addDoc(col, base)

    // 2) si fichier présent → upload + mise à jour imageUrl
    if (payload.file) {
      const ext = payload.file.name.split('.').pop() || 'jpg'
      const r = sref(st, `families/${familyId.value}/items/${docRef.id}/image.${ext}`)

      await uploadBytes(r, payload.file, { contentType: payload.file.type })
      const url = await getDownloadURL(r)
      // console.log('Image URL générée :', url)

      await updateDoc(doc(db, 'families', familyId.value!, 'items', docRef.id), {
        imageUrl: url,
        updatedAt: serverTimestamp(),
      })
    }
  }

  async function subtract(id: string, amount: number) {
    const app = getApp()
    const db = getFirestore(app)
    const { familyId } = useAuth()
    const ref = doc(db, 'families', familyId.value!, 'items', id)

    const it = items.value.find((i) => i.id === id)
    const next = Math.max(0, (it?.quantity ?? 0) - amount)

    await updateDoc(ref, { quantity: next, updatedAt: serverTimestamp() })
  }

  async function remove(id: string) {
    const app = getApp()
    const db = getFirestore(app)
    const st = getStorage(app)
    const { familyId } = useAuth()

    await deleteDoc(doc(db, 'families', familyId.value!, 'items', id))

    // supprimer image (quelque soit l'extension)
    try {
      const basePath = `families/${familyId.value}/items/${id}`
      const possibleExt = ['jpg', 'jpeg', 'png', 'webp']
      for (const ext of possibleExt) {
        try {
          await deleteObject(sref(st, `${basePath}/image.${ext}`))
          break
        } catch {
          /* ignore si l'objet n'existe pas */
        }
      }
    } catch {
      /* pas d'image */
    }
  }

  return { items, bind, unbind, add, subtract, remove }
})
