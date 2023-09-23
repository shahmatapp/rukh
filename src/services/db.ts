
const STORES=[
    {name:"Book", key:"id"}
];
let DB:IDBDatabase;

const initDB =()=>{
    return new Promise<IDBDatabase>((resolve,reject)=>{
        const DB_NAME="RUKH";
        const DB_VERSION = 1;
        const indexDBRequest = window.indexedDB.open(DB_NAME, DB_VERSION);

        indexDBRequest.onerror = (err) => {
            console.log(err);
            reject(err)
        }
        indexDBRequest.onsuccess = function() {
            // if another db does a db upgrade , notify this tab
            DB = indexDBRequest.result;
            DB.onversionchange = event => {
                DB.close();
                alert("A new version of this page is ready. Please reload or close this tab!");
            };
            resolve(DB);
        };

        indexDBRequest.onupgradeneeded = function(event) {
            console.log('Upgrading DB .. ')
            let db = indexDBRequest.result;
            STORES.forEach((store)=>{
                if (!db.objectStoreNames.contains(store.name)) { // if there's no store
                    console.log(`Creating ${store.name}`)
                    db.createObjectStore(store.name, {keyPath: store.key}); // create it
                }
            })
        };
    })

}


export {initDB}
export default async function getDB(){
    return  DB;
};

