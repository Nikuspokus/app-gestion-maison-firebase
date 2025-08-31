// services/ensureUserProfile.ts
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

/**
 * Crée/MAJ le profil user et garantit un familyId.
 * - Si aucun familyId trouvé, en génère un (ex: fam-<uid>).
 * - Retourne le familyId utilisé.
 */
export async function ensureUserProfile(): Promise<string> {
    const { $firebase } = useNuxtApp()
    const user = $firebase.auth.currentUser
    if (!user) throw new Error('No authenticated user')

    const userRef = doc($firebase.db, 'users', user.uid)
    const snap = await getDoc(userRef)

    // 1) Cas nouveau user : créer un familyId “perso”
    if (!snap.exists()) {
        const familyId = `fam-${user.uid.slice(0, 8)}`
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName ?? null,
            email: user.email ?? null,
            photoURL: user.photoURL ?? null,
            familyId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, { merge: true })

        // (optionnel) créer la racine famille pour toi
        await setDoc(doc($firebase.db, 'families', familyId), {
            ownerUid: user.uid,
            createdAt: serverTimestamp()
        }, { merge: true })

        return familyId
    }

    // 2) Cas user existant : s’assurer qu’un familyId est là, sinon en créer un
    const data = snap.data() as { familyId?: string }
    if (!data?.familyId) {
        const familyId = `fam-${user.uid.slice(0, 8)}`
        await setDoc(userRef, { familyId, updatedAt: serverTimestamp() }, { merge: true })
        await setDoc(doc($firebase.db, 'families', familyId), {
            ownerUid: user.uid,
            createdAt: serverTimestamp()
        }, { merge: true })
        return familyId
    }

    return data.familyId
}
