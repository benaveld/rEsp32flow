import RelayApi from "./relayApi"

export function stopRelay(){
  return RelayApi.put({stop: 1});
}

export function startRelay(profileId: number){
  return RelayApi.put({profileId: profileId });
}