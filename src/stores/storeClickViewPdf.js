import create from 'zustand';

const useClickViewPdfStore = create((set) => ({
    isModalOpen: false,
    link: '',
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
    setLink: (newLink) => set({ link: newLink }),
    handleClickViewPDF: (newLink) => {
        set({ link: newLink, isModalOpen: true }); // Set link and open modal
    },
}));

export default useClickViewPdfStore;
