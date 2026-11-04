import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD4eEHntHzjs6SPjPf2Djaka7vAnvrgYPo",
  authDomain: "malan-snacks.firebaseapp.com",
  projectId: "malan-snacks",
  storageBucket: "malan-snacks.firebasestorage.app",
  messagingSenderId: "930913775226",
  appId: "1:930913775226:web:bb1b1a4f7bc2de33be15c3",
  measurementId: "G-KWKLW2C2NV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

window.fbSave = function(coll, id, data, m) {
  const r = doc(db, coll, id);
  (m === 'u' ? updateDoc(r, data) : setDoc(r, data)).catch(e => window.flash('No se pudo guardar: ' + e.message));
};
window.fbAdd = function(coll, data) {
  addDoc(collection(db, coll), data).catch(e => window.flash('No se pudo guardar: ' + e.message));
};
window.fbDel = function(coll, id) {
  deleteDoc(doc(db, coll, id)).catch(() => {});
};
window.login = function(email, pass) {
  return signInWithEmailAndPassword(auth, email, pass);
};
window.onAuth = function(callback) {
  onAuthStateChanged(auth, callback);
};
window.fbSnap = function(coll, callback) {
  onSnapshot(collection(db, coll), sn => {
    const res = {};
    sn.docs.forEach(d => res[d.id] = d.data());
    callback(res, sn.metadata.hasPendingWrites);
  });
};
window.fbDoc = function(coll, id, callback) {
  onSnapshot(doc(db, coll, id), sn => {
    callback(sn.exists() ? sn.data() : null);
  });
};
