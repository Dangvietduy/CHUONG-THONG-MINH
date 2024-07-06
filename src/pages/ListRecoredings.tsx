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
  IonButtons,
  IonIcon,
  IonAlert,
  IonToast,
} from "@ionic/react";
import { storage } from "../firebaseConfig";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { refresh, play, trash, arrowBack } from "ionicons/icons"; // Import necessary icons

import "./ListRecoredings.css"; // Adjust the path according to your project structure

interface Recording {
  url: string;
  name: string;
  fullPath: string;
  size: number; // Size in bytes
  timeCreated: string; // Upload date and time
}

const AudioList: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  ); // State to hold reference to audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [confirmDelete, setConfirmDelete] = useState(false); // State to handle delete confirmation

  const loadRecordings = async () => {
    try {
      const storageRef = ref(storage, "recordings");
      const result = await listAll(storageRef);

      const recordingsData: Recording[] = await Promise.all(
        result.items.map(async (audioRef) => {
          const url = await getDownloadURL(audioRef);
          const metadata = await getMetadata(audioRef); // Fetch metadata
          const name = audioRef.name;
          const fullPath = audioRef.fullPath;
          const size = metadata.size;
          const timeCreated = new Date(metadata.timeCreated).toLocaleString(); // Format date and time

          return { url, name, fullPath, size, timeCreated };
        })
      );

      // Sort recordingsData to display the newest first (if needed)
      setRecordings(recordingsData.reverse());
    } catch (error) {
      console.error("Error loading recordings:", error);
    }
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  const openModal = (recording: Recording) => {
    setSelectedRecording(recording);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedRecording(null);
    setShowModal(false);
    if (audioElement) {
      audioElement.pause(); // Pause audio when modal closes
      setIsPlaying(false); // Reset play state
    }
  };

  const togglePlay = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause();
      } else {
        audioElement.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const deleteRecording = async (recording: Recording) => {
    try {
      await deleteObject(ref(storage, recording.fullPath));
      // Remove deleted recording from state
      setRecordings((prevRecordings) =>
        prevRecordings.filter((r) => r.fullPath !== recording.fullPath)
      );
      closeModal(); // Close modal after deletion
    } catch (error) {
      console.error("Error deleting recording:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Danh Sách Ghi Âm</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={loadRecordings}>
              <IonIcon icon={refresh} />
            </IonButton>
            &nbsp;&nbsp;&nbsp;
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {recordings.map((recording, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>
                  {index + 1}. &nbsp;{recording.name}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton
                  onClick={() => openModal(recording)}
                  fill="clear"
                  slot="end"
                >
                  Mở
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        {/* Modal for audio playback */}
        <IonModal isOpen={showModal} onDidDismiss={closeModal}>
          <IonHeader>
            <IonToolbar>
            <IonTitle>Chi Tiết Ghi Âm</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={closeModal}>
                  <IonIcon icon={arrowBack} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="modal-content">
            {selectedRecording && (
              <>
                <div className="details-container">
                  <audio
                    className="audio-content"
                    controls
                    ref={(element) => setAudioElement(element)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src={selectedRecording.url} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                  <p>
                    <strong>Tên tệp tin:</strong> {selectedRecording.name}
                  </p>
                  <p>
                    <strong>Dung lượng:</strong>{" "}
                    {(selectedRecording.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p>
                    <strong>Ngày đăng tải:</strong>{" "}
                    {selectedRecording.timeCreated}
                  </p>

                  <IonButton
                    onClick={() => setConfirmDelete(true)}
                    className="delete-button"
                  >
                    <IonIcon icon={trash} /> Xóa
                  </IonButton>
                </div>
              </>
            )}
          </IonContent>
        </IonModal>

        {/* Alert for delete confirmation */}
        <IonAlert
          isOpen={confirmDelete}
          onDidDismiss={() => setConfirmDelete(false)}
          header={"Xác nhận xóa"}
          message={"Bạn chắc chắn xóa tệp tin này chứ ?"}
          buttons={[
            {
              text: "Hủy",
              role: "cancel",
              cssClass: "secondary",
              handler: () => {
                console.log("Hủy không xóa");
              },
            },
            {
              text: "Xóa",
              handler: () => {
                if (selectedRecording) {
                  deleteRecording(selectedRecording);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default AudioList;
