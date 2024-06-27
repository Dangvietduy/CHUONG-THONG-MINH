import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonModal,
} from "@ionic/react";
import { storage } from "../firebaseConfig";
import { ref, listAll, getDownloadURL } from "firebase/storage";

const AudioList: React.FC = () => {
  const [recordings, setRecordings] = useState<string[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<string | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const storageRef = ref(storage, "recordings");
        const result = await listAll(storageRef);

        const urlPromises = result.items.map((audioRef) =>
          getDownloadURL(audioRef)
        );

        const urls = await Promise.all(urlPromises);
        // Sắp xếp urls theo thứ tự mới nhất lên đầu
        setRecordings(urls.reverse());
      } catch (error) {
        console.error("Error loading recordings:", error);
      }
    };

    loadRecordings();
  }, []);

  const openModal = (url: string) => {
    setSelectedRecording(url);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRecording(null);
    setShowModal(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Recordings List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {recordings.map((url, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>Recording {index + 1}</IonCardTitle>
                <IonCardSubtitle>...</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton
                  onClick={() => openModal(url)}
                  fill="clear"
                  slot="end"
                >
                  Play
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal for audio playback */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Playback</IonTitle>
              <IonButton slot="end" onClick={closeModal}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            {selectedRecording && (
              <audio controls>
                <source src={selectedRecording} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
            <IonButton onClick={() => {
              // Implement delete functionality here
              // Example: deleteRecording(selectedRecording);
              closeModal();
            }}>
              Delete
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AudioList;
