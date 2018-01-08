'use strict';

import {
    AsyncStorage,
} from 'react-native';
import Utils from '../../util/Utils'
import DataRepository, {FLAG_STORAGE} from '../../expand/dao/DataRepository'

export default class RepositoryUtils {
    constructor(aboutCommon) {
        this.aboutCommon = aboutCommon;
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my);
        this.itemMap = new Map();
    }

    /**
     * 更新数据
     * @param k
     * @param v
     */
    updateData(k,v){
        this.itemMap.set(k,v);
        var arr=[];
        for (var value of this.itemMap.values()) {
            arr.push(value);
        }
        this.aboutCommon.onNotifyDataChanged(arr);
    }
    /**
     * 获取指定url对应的数据
     * @param url
     */
    fetchRepository(url) {
        this.dataRepository.fetchRepository(url)
            .then(result=> {
                if (result) {
                    this.updateData(url,result);
                    if (!Utils.checkDate(result.update_date))return this.dataRepository.fetchNetRepository(url);
                } else {
                    return this.dataRepository.fetchNetRepository(url);
                }
            })
            .then((item)=> {
                if (item) {
                    this.updateData(url,item);
                }
            }).catch(e=> {
        })
    }

    /**
     * 批量获取url对应的数据
     * @param urls
     */
    fetchRepositories(urls) {
        for (let i = 0, l = urls.length; i < l; i++) {
            var url = urls[i];
            this.fetchRepository(url);
        }
    }
}
