import { Provider } from "react-redux";
import ProfileList from "./profile/profileList";
import { store } from "./state";

function App() {
  return (
    <Provider store={store}>
      <ProfileList />
    </Provider>
  );
}

export default App;
