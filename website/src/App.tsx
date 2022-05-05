import { Provider } from "react-redux";
import { store } from "./state";
import TemperatureChart from "./temperature/temperature";

function App() {
  return (
    <Provider store={store}>
      <TemperatureChart />
    </Provider>
  );
}

export default App;