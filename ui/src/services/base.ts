import getDB from './db'
interface D{type:string,data:any}

class BaseService{
    storeName:string;
    constructor(storeName:string){
        this.storeName = storeName;

    }

    async save(row:object){

        let db = await getDB();
        let tx = db.transaction([this.storeName], 'readwrite');
        let store = tx.objectStore(this.storeName);
        store.put(row);
        tx.commit();
    }

    async remove(key:string){
        let db = await getDB();
        let tx = db.transaction(this.storeName, 'readwrite');
        tx.objectStore(this.storeName).delete(key);
        tx.commit();
    }

    async get(key:string){
        return new Promise(async (resolve,reject)=>{
            let db = await getDB();
            let tx = db.transaction(this.storeName, 'readwrite');
            let request =  tx.objectStore(this.storeName).get(key);
            request.onsuccess = function(_) {
                resolve(request.result)
            };
            request.onerror = function(event) {
                reject(event)
            };
        });

    }

    getAll(){
        return new Promise(async (resolve,reject)=>{
            let db = await getDB();
            let tx = db.transaction([this.storeName], 'readonly');
            let request = tx.objectStore(this.storeName).getAll();
            request.onsuccess = function(_) {
                resolve(request.result)
            };
            request.onerror = function(event) {
                reject(event)
            };
            tx.commit();
        })

    }

}


export default BaseService;

export type {D}