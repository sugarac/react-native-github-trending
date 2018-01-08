/**
 * Created by penn on 2016/12/21.
 */

import {
    AsyncStorage,
} from 'react-native';
import Trending from "GitHubTrending";
export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'}

export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending)this.treding = new Trending();
    }

    saveRepository(url, items, callback) {
        if (!items || !url)return;
        let wrapData;
        if (this.flag === FLAG_STORAGE.flag_my) {
            wrapData = {item: items, update_date: new Date().getTime()};
        } else {
            wrapData = {items: items, update_date: new Date().getTime()};
        }
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    fetchRepository(url) {
        return new Promise((resolve, reject)=> {
            this.fetchLocalRepository(url).then((wrapData)=> {
                if (wrapData) {
                    resolve(wrapData, true);
                } else {
                    this.fetchNetRepository(url).then((data)=> {
                        resolve(data);
                    }).catch((error)=> {
                        reject(error);
                    })
                }

            }).catch((error)=> {
                this.fetchNetRepository(url).then((data)=> {
                    resolve(data);
                }).catch((error=> {
                    reject(error);
                }))
            })
        })
    }

    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }

    fetchNetRepository(url) {
        return new Promise((resolve, reject)=> {
            if (this.flag !== FLAG_STORAGE.flag_trending) {
                fetch(url)
                    .then((response)=>response.json())
                    .catch((error)=> {
                        reject(error);
                    }).then((responseData)=> {
                    if (this.flag === FLAG_STORAGE.flag_my && responseData) {
                        this.saveRepository(url, responseData)
                        resolve(responseData);
                    } else if (responseData && responseData.items) {
                        this.saveRepository(url, responseData.items)
                        resolve(responseData.items);
                    } else {
                        reject(new Error('responseData is null'));
                    }
                })
            } else {
                this.treding.fetchTrending(url)
                    .then((items)=> {
                        if (!items) {
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(items);
                        this.saveRepository(url, items)
                    }).catch((error)=> {
                    reject(error);
                })
            }
        })
    }
}