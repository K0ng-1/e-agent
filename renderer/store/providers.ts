import { Provider } from "@common/types";
import { dataBase } from "@renderer/dataBase";
import { create } from "zustand";

type State = {
  providers: Provider[];
};

type Actions = {
  initialize(): Promise<void>;
};

type Store = State & Actions;

const useProvidersStore = create<Store>()((set) => {
  return {
    // state
    providers: [],

    // actions
    async initialize() {
      const providers = await dataBase.providers.toArray();
      set({ providers });
    },
  };
});

export default useProvidersStore;
