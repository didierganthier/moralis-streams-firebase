import "./App.css";
import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  query,
  collection,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import env from "react-dotenv";

const { API_KEY, PROJECT_ID, BUCKET_NAME, AUTH_DOMAIN, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID } = env;

console.log(API_KEY);

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: BUCKET_NAME,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [txs, setTxs] = useState(null);

  useEffect(() => {
    console.log("start");
    const q = query(collection(db, "moralis/txs/Polygontestnet"));
    console.log("query has been setup");
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempTxs = [];
      querySnapshot.forEach((doc) => {
        tempTxs.push(doc.data());
      });
      setTxs(tempTxs);
    });


    //Stop realtime updates:
    //unsubscribe();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p className="mb-10">🔥 Firebase Moralis Streams Extension 🔥</p>
        <div class="overflow-x-auto relative">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="py-3 px-6">
                  From
                </th>
                <th scope="col" class="py-3 px-6">
                  To
                </th>
                <th scope="col" class="py-3 px-6">
                  Amount
                </th>
                <th scope="col" class="py-3 px-6">
                  Block
                </th>
              </tr>
            </thead>
            <tbody>
              {txs?.map((e, i) => {
                return (
                  <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {e.fromAddress}
                  </th>
                  <td class="py-4 px-6">
                    {e.toAddress}
                  </td>
                  <td class="py-4 px-6">
                    {e.value / 1E18} Matic
                  </td>
                  <td class="py-4 px-6">
                    {e.blockNumber}
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </header>
    </div>
  );
}
export default App;