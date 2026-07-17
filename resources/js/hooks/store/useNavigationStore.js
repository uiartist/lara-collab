import { produce } from 'immer';
import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  items: [],
  setItems: (items) => set(() => ({ items: [...items] })),
  toggle: (label) => {
    return set(produce(state => {
      state.items.forEach(item => {
        if (item.opened !== undefined) {
          if (item.label === label) {
            const index = state.items.findIndex(i => i.label === label);
            state.items[index].opened = !state.items[index].opened;
          } else {
            item.opened = false;
          }
        }
      });
    }));
  },
  active: (label, isSubItem) => {
    return set(produce(state => {
      const processItem = (item) => {
        const hasLinks = Array.isArray(item.links);
        let itemHasActive = false;

        if (hasLinks) {
          item.links.forEach((child) => {
            const childActive = processItem(child);
            if (childActive) {
              itemHasActive = true;
            }
          });

          item.active = itemHasActive;
          item.opened = itemHasActive;
        } else {
          if (item.label === label && isSubItem) {
            item.active = true;
            itemHasActive = true;
          } else if (item.label === label && !isSubItem) {
            item.active = true;
            itemHasActive = true;
          } else {
            item.active = false;
          }
        }

        return itemHasActive;
      };

      state.items.forEach((item) => {
        processItem(item);
      });
    }));
  },
}));

export default useNavigationStore;
