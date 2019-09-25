export default (
  () => {
      let storage;
      try {
        const test_storage = '__TEST_STORAGE__';
        (storage = window.localStorage).setItem(test_storage, test_storage);
        const fail = storage.getItem(test_storage) !== test_storage;
        storage.removeItem(test_storage);
        fail && (storage = false);
      } catch (e) {}

      return {
          set: (key, object) => {
              if (storage) {
                storage.setItem(
                    key,
                    (typeof object) === 'string' ? object : JSON.stringify(object));
              }
          },
          get: (key) => {
              if (!storage) {
                  return null;
              }
              const value = storage[key];
              if (!value) {
                return null;
              }
              try {
                  const parsed = JSON.parse(value);
                  return parsed;
              } catch (e) {
                  return value;
              }
          },
          remove: (key) => {
              if (storage) {
                  storage.removeItem(key);
              }
          }
      };
  }
)();