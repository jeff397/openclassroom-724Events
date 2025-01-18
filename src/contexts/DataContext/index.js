import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  let lastEvent = null;

  const loadDataEvent = async () => {
    try {
      const dataEvent = await api.loadData();
      if (dataEvent && dataEvent.events) {
        lastEvent = dataEvent.events.reduce(
          (latest, event) =>
            new Date(event.date) > new Date(latest.date) ? event : latest,
          dataEvent.events[0]
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        await loadDataEvent();
      } catch (err) {
        console.error("Error in loadDataEvent:", err);
      }
    };
    load();
  }, []);

  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
      const loadedData = await api.loadData();
      setData(loadedData);
      setLast(lastEvent);
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  }, [data, getData]);

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
