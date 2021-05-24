const request = indexedDB.open("localforage");
request.onsuccess = successEventData => {
  const database = successEventData.target.result;
  const transaction = database.transaction(["keyvaluepairs"]);
  const objectStore = transaction.objectStore("keyvaluepairs");
  const request = objectStore.get("state");
  request.onsuccess = requestSuccessEventData => {
    const authData = requestSuccessEventData.target.result.auth;
    const activeAccount = authData.active;
    const session = authData.accounts[activeAccount].session;
    alert(
      `Session ID: ${session.id} / User ID: ${session.user_id} / Token: ${session.session_token}`
    );
  };
};
