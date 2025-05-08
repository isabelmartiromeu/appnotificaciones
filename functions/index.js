const { onSchedule } = require("firebase-functions/v2/scheduler");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

exports.eliminarNotificacionesVencidas = onSchedule("every 5 minutes", async () => {
  const ahora = Timestamp.now();
  const notificacionesRef = db.collection("notificaciones");

  const querySnapshot = await notificacionesRef.where("fechaHoraFin", "<", ahora).get();

  if (!querySnapshot.empty) {
    querySnapshot.forEach(doc => {
      doc.ref.delete().then(() => {
        console.log('Documento ${doc.id} eliminado correctamente');
      }).catch((error) => {
        console.error('Error al eliminar documento ${doc.id}:', error);
      });
    });
  } else {
    console.log("No hay documentos vencidos para eliminar.");
  }
});
