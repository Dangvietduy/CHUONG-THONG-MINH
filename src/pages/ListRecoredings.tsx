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
} from "@ionic/react";
import { storage } from "../firebaseConfig";
import { ref, listAll, getDownloadURL, getMetadata, deleteObject } from "firebase/storage";
import { arrowBack, arrowForward, play, pause, trash } from 'ionicons/icons'; // Import play, pause, and trash icons from ionicons

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
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null); // State to hold reference to audio element
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [confirmDelete, setConfirmDelete] = useState(false); // State to handle delete confirmation

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate the items to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = recordings.slice(indexOfFirstItem, indexOfLastItem);

  // Create array of page buttons
  const pageButtons = [];
  for (let i = 1; i <= Math.ceil(recordings.length / itemsPerPage); i++) {
    pageButtons.push(
      <IonButton
        key={i}
        onClick={() => handlePageChange(i)}
        color={i === currentPage ? "primary" : "medium"}
      >
        {i}
      </IonButton>
    );
  }

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
          <IonTitle>Recordings List</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
            <IonButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentItems.length < itemsPerPage}
            >
              <IonIcon icon={arrowForward} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          {currentItems.map((recording, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>
                  Recording {indexOfFirstItem + index + 1}
                </IonCardTitle>
                <IonCardSubtitle className="subtitle">{recording.name}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton
                  onClick={() => openModal(recording)}
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
                <audio className="audio-content"
                  controls
                  ref={(element) => setAudioElement(element)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={selectedRecording.url} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
                  <p><strong>Name:</strong> {selectedRecording.name}</p>
                  <p><strong>Size:</strong> {(selectedRecording.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Uploaded At:</strong> {selectedRecording.timeCreated}</p>
                
                <IonButton onClick={() => setConfirmDelete(true)} className="delete-button">
                  <IonIcon icon={trash} /> Delete
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
          header={'Confirm Delete'}
          message={'Are you sure you want to delete this recording?'}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Cancel delete');
              }
            },
            {
              text: 'Delete',
              handler: () => {
                if (selectedRecording) {
                  deleteRecording(selectedRecording);
                }
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default AudioList;
