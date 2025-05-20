import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_: string, value: string): Promise<string> {
      return Promise.resolve(value);
    },
    removeItem(_: string): Promise<void> {
      return Promise.resolve();
    },    
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
