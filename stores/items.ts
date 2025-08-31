import { defineStore } from 'pinia'
import {
  getFirestore, collection, query, orderBy, onSnapshot,
  addDoc, doc, deleteDoc, updateDoc, serverTimestamp
} from 'firebase/firestore'
import {
  deleteObject, getStorage, ref as sref, uploadBytes, getDownloadURL
} from 'firebase/storage'
import { getApp } from 'firebase/app'
import { ref } from 'vue'
import type { Item, Unit } from '@/types'
import { useAuth } from '@/composables/useAuth'

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])
  let unsubs: Array<() => void> = []

  function ensureAuth() {
    const { user, familyId } = useAuth()
    if (!user.value) throw new Error('Non connecté')
    if (!familyId.value) throw new Error('familyId manquant')
    return { user, familyId }
  }

  function bind() {
    unbind()

    const app = getApp()
    const db = getFirestore(app)
    const { user, familyId } = useAuth()

    if (!user.value || !familyId.value) {
      // Pas encore prêt (auth async) : ne bind pas
      return
    }

    const qItems = query(
      collection(db, 'families', familyId.value, 'items'),
      orderBy('updatedAt', 'desc')
    )

    const unsub = onSnapshot(
      qItems,
      (snap) => {
        items.value = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
      },
      (err) => {
        console.error('[items.bind] snapshot error:', err)
        // typiquement: permission-denied → laisse la liste vide
        items.value = []
      }
    )
    unsubs.push(unsub)
  }

  function unbind() {
    unsubs.forEach((u) => u())
    unsubs = []
  }

  async function add(payload: { name: string; quantity: number; unit: Unit; file?: File }) {
    const { user, familyId } = ensureAuth()
    const app = getApp()
    const db = getFirestore(app)
    const st = getStorage(app)

    try {
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
      const colRef = collection(db, 'families', familyId.value!, 'items')
      const docRef = await addDoc(colRef, base)

      // 2) si fichier présent → upload + mise à jour imageUrl
      if (payload.file) {
        const ext = (payload.file.name.split('.').pop() || 'jpg').toLowerCase()
        const path = `families/${familyId.value}/items/${docRef.id}/image.${ext}`
        const fileRef = sref(st, path)

        await uploadBytes(fileRef, payload.file, { contentType: payload.file.type })
        const url = await getDownloadURL(fileRef)

        await updateDoc(doc(db, 'families', familyId.value!, 'items', docRef.id), {
          imageUrl: url,
          updatedAt: serverTimestamp(),
        })
      }
    } catch (e: any) {
      console.error('[items.add] error:', e)
      // remonte un message clair pour l’UI
      if (e?.code === 'permission-denied') {
        throw new Error('Permission refusée : vérifie les règles Firestore/Storage.')
      }
      throw new Error(e?.message || 'Erreur lors de l’enregistrement')
    }
  }

  async function subtract(id: string, amount: number) {
    const { familyId } = ensureAuth()
    const app = getApp()
    const db = getFirestore(app)

    const it = items.value.find((i) => i.id === id)
    const next = Math.max(0, (it?.quantity ?? 0) - amount)

    try {
      const refDoc = doc(db, 'families', familyId.value!, 'items', id)
      await updateDoc(refDoc, { quantity: next, updatedAt: serverTimestamp() })
    } catch (e: any) {
      console.error('[items.subtract] error:', e)
      throw new Error(e?.message || 'Erreur lors de la mise à jour de la quantité')
    }
  }

  async function remove(id: string) {
    const { familyId } = ensureAuth()
    const app = getApp()
    const db = getFirestore(app)
    const st = getStorage(app)

    try {
      await deleteDoc(doc(db, 'families', familyId.value!, 'items', id))
    } catch (e: any) {
      console.error('[items.remove] deleteDoc error:', e)
      throw new Error(e?.message || 'Erreur lors de la suppression')
    }

    // suppression image (toutes extensions courantes)
    const basePath = `families/${familyId.value}/items/${id}`
    const possibleExt = ['jpg', 'jpeg', 'png', 'webp']
    for (const ext of possibleExt) {
      try {
        await deleteObject(sref(st, `${basePath}/image.${ext}`))
        break // si une suppr réussit, on sort
      } catch {
        /* ignore si l'objet n'existe pas */
      }
    }
  }

  async function addAmount(id: string, amount: number) {
    const { familyId } = ensureAuth()
    const app = getApp()
    const db = getFirestore(app)

    const it = items.value.find((i) => i.id === id)
    const next = Math.max(0, (it?.quantity ?? 0) + amount) // on ajoute

    try {
      const refDoc = doc(db, 'families', familyId.value!, 'items', id)
      await updateDoc(refDoc, { quantity: next, updatedAt: serverTimestamp() })
    } catch (e: any) {
      console.error('[items.addAmount] error:', e)
      throw new Error(e?.message || 'Erreur lors de l’ajout de quantité')
    }
  }

  return { items, addAmount, bind, unbind, add, subtract, remove }
})
