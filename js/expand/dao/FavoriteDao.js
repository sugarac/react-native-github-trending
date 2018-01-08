/**
 * FavoriteDao
 * @flow
 */
'use strict';


import {
  AsyncStorage,
} from 'react-native';

const FAVORITE_KEY_PREFIX='favorite_'

export default class FavoriteDao{
  constructor(flag) {
    this.flag = flag;
    this.favoriteKey=FAVORITE_KEY_PREFIX+flag;
  }

  /**
   * 收藏项目,保存收藏的项目
   * @param key 项目id
   * @param value 收藏的项目
   * @param callback
   */
  saveFavoriteItem(key,value,callback) {
    AsyncStorage.setItem(key,value,(error,result)=>{
      if (!error) {//更新Favorite的key
        this.updateFavoriteKeys(key,true);
      }
    });
  }
  /**
   * 更新Favorite key集合
   * @param isAdd true 添加,false 删除
   * **/
  updateFavoriteKeys(key,isAdd){
    AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
      if (!error) {
        var favoriteKeys=[];
        if (result) {
          favoriteKeys=JSON.parse(result);
        }
        var index=favoriteKeys.indexOf(key);
        if(isAdd){
          if (index===-1)favoriteKeys.push(key);
        }else {
          if (index!==-1)favoriteKeys.splice(index, 1);
        }
        AsyncStorage.setItem(this.favoriteKey,JSON.stringify(favoriteKeys));
      }
    });
  }

  /**
   * 获取收藏的Repository对应的key
   * @return {Promise}
   */
  getFavoriteKeys(){
    return new Promise((resolve,reject)=>{
      AsyncStorage.getItem(this.favoriteKey,(error,result)=>{
        if (!error) {
          try {
            resolve(JSON.parse(result));
          } catch (e) {
            reject(error);
          }
        }else {
          reject(error);
        }
      });
    });
  }

  /**
   * 取消收藏,移除已经收藏的项目
   * @param key 项目 id
   */
  removeFavoriteItem(key) {
    AsyncStorage.removeItem(key,(error,result)=>{
      if (!error) {
        this.updateFavoriteKeys(key,false);
      }
    });
  }

  /**
   * 获取所以收藏的项目
   * @return {Promise}
   */
  getAllItems() {
    return new Promise((resolve,reject)=> {
      this.getFavoriteKeys().then((keys)=> {
        var items = [];
        if (keys) {
          AsyncStorage.multiGet(keys, (err, stores) => {
            try {
              stores.map((result, i, store) => {
                // get at each store's key/value so you can work with it
                let key = store[i][0];
                let value = store[i][1];
                if (value)items.push(JSON.parse(value));
              });
              resolve(items);
            } catch (e) {
              reject(e);
            }
          });
        } else {
          resolve(items);
        }
      }).catch((e)=> {
        reject(e);
      })
    })
  }
}

