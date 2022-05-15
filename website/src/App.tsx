import { Provider } from "react-redux";
import ProfileList from "./profile/profileList";
import { store } from "./state";
import StatusView from "./status/statusView";
import TemperatureChart from "./temperature/temperature";

function App() {
  return (
    <Provider store={store}>
      <StatusView />
      <ProfileList />
      <TemperatureChart />
    </Provider>
  );
}

export default App;
