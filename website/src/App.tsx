import { Provider } from "react-redux";
import ProfileList from "./profile/profileList";
import { store } from "./state";
import TemperatureChart from "./temperature/temperature";

function App() {
  return (
    <Provider store={store}>
      <ProfileList />
      <TemperatureChart />
    </Provider>
  );
}

export default App;
