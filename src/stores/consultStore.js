import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConsultStore = create(
  persist(
    (set, get) => ({
      // Current appointment ID
      currentAppointmentId: null,

      // Consult Notes State - Initially empty
      consultNotes: {
        chiefComplaint: '',
        assessment: '',
        historyOfPresentIllness: '',
        plan: '',
        followUpInstructions: '',
        diagnosis: '',
        prescription: '',
        followUpNeeded: 'false',
        followUpDate: null,
      },

      setConsultNoteField: (field, value) =>
        set((state) => ({
          consultNotes: {
            ...state.consultNotes,
            [field]: value,
          },
        })),

      // Action to set all consult notes at once (for a single consultation)
      setConsultNotes: (notes) => set({ consultNotes: notes }),

      // Action to clear consult notes
      clearConsultNotes: () =>
        set({
          consultNotes: {
            chiefComplaint: '',
            assessment: '',
            historyOfPresentIllness: '',
            plan: '',
            followUpInstructions: '',
            diagnosis: '',
            prescription: '',
            followUpNeeded: 'false',
            followUpDate: null,
          },
        }),

      clearPrescription: () =>
        set({
          prescribedDrugs: [],
          prescriptionEntry: {
            drugSearch: '',
            dosage: 'Select dosage',
            frequency: 'Select frequency',
            route: 'Select route',
            duration: 'Select duration',
            notes: '',
          },
        }),
      clearLabOrders: () => set({ selectedLabTests: [] }),

      // NEW ACTIONS for appointment management
      setCurrentAppointmentId: (appointmentId) => {
        console.log('Setting appointment ID in store:', appointmentId);
        set({ currentAppointmentId: appointmentId });
      },

      clearCurrentAppointment: () => {
        console.log('Clearing current appointment data');
        set({
          currentAppointmentId: null,
          currentPatient: null,
          prescribedDrugs: [],
          selectedLabTests: [],
          prescriptionEntry: {
            drugSearch: '',
            dosage: 'Select dosage',
            frequency: 'Select frequency',
            route: 'Select route',
            duration: 'Select duration',
            notes: '',
          },
        });
      },

      // Prescriptions State
      prescriptionEntry: {
        drugSearch: '',
        dosage: 'Select dosage',
        frequency: 'Select frequency',
        route: 'Select route',
        duration: 'Select duration',
        notes: '',
      },

      setPrescriptionEntryField: (field, value) =>
        set((state) => ({
          prescriptionEntry: {
            ...state.prescriptionEntry,
            [field]: value,
          },
        })),

      // Initialize as empty array, will be populated from API
      prescribedDrugs: [],

      addPrescribedDrug: (newDrug) =>
        set((state) => ({
          prescribedDrugs: [...state.prescribedDrugs, { ...newDrug, active: true }],
        })),

      updatePrescribedDrug: (index, updatedDrug) =>
        set((state) => ({
          prescribedDrugs: state.prescribedDrugs.map((drug, i) => (i === index ? { ...drug, ...updatedDrug } : drug)),
        })),

      deletePrescribedDrug: (index) =>
        set((state) => ({
          prescribedDrugs: state.prescribedDrugs.filter((_, i) => i !== index),
        })),

      // NEW: Action to set all prescribed drugs at once
      setPrescribedDrugs: (drugs) => set({ prescribedDrugs: drugs }),

      // Lab Results State
      selectedLabTests: [], // Initialize as empty array, will be populated from API
      addLabTest: (test) =>
        set((state) => ({
          selectedLabTests: [...state.selectedLabTests, test],
        })),

      removeLabTest: (index) =>
        set((state) => ({
          selectedLabTests: state.selectedLabTests.filter((_, i) => i !== index),
        })),

      // NEW: Action to set all selected lab tests at once
      setSelectedLabTests: (tests) => set({ selectedLabTests: tests }),

      // Previous Visits State
      previousVisits: [], // Initialize as empty array, will be populated from API

      // NEW: Action to set all previous visits at once
      setPreviousVisits: (visits) => set({ previousVisits: visits }),

      // Current patient data for consultation
      currentPatient: null,
      setCurrentPatient: (patientData) => {
        console.log('Setting current patient in store:', patientData);
        set({ currentPatient: patientData });
      },

      getCurrentState: () => get(),

      // Clear all consultation data (useful when starting a new consultation)
      clearAllConsultationData: () => {
        set({
          currentAppointmentId: null,
          currentPatient: null,
          consultNotes: {
            chiefComplaint: '',
            assessment: '',
            historyOfPresentIllness: '',
            plan: '',
            followUpInstructions: '',
            diagnosis: '',
            prescription: '',
            followUpNeeded: 'false',
            followUpDate: null,
          },
          selectedLabTests: [],
          prescribedDrugs: [],
          previousVisits: [],
        });
      },
    }),
    {
      name: 'consult-details-storage',
      // Only persist certain fields to avoid storing too much data
      partialize: (state) => ({
        currentAppointmentId: state.currentAppointmentId,
        currentPatient: state.currentPatient,
        consultNotes: state.consultNotes,
        prescribedDrugs: state.prescribedDrugs,
        selectedLabTests: state.selectedLabTests,
        prescriptionEntry: state.prescriptionEntry,
        previousVisits: state.previousVisits,
      }),
    },
  ),
);
