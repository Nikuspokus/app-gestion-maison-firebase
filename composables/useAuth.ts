
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { useFirebase } from '@/services/firebase'

const userRef = ref<User | null>(null)
const familyIdRef = ref<string | null>(null)

export function useAuth() {
  const { app } = useFirebase()
  const auth = getAuth(app)
  if (!auth._isInitialized) {
    // noop
  }
  if (!userRef.value) {
    onAuthStateChanged(auth, (u) => {
      userRef.value = u
      familyIdRef.value = u ? u.uid : null // MVP: familyId = uid, à remplacer par groupe partagé
    })
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }
  async function signOutUser() {
    await signOut(auth)
  }

  return {
    user: userRef,
    familyId: familyIdRef,
    signInWithGoogle,
    signOutUser
  }
}
