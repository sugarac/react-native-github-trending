/**
 * AboutPage
 * 关于
 * @flow
 */
'use strict';


import React, {Component} from 'react';
import {
    Dimensions,
    Image,
    ListView,
    Platform,
    PixelRatio,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import UShare from '../../common/UShare';
import RepositoryCell from '../../common/RepositoryCell';
import BackPressComponent from '../../common/BackPressComponent'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import share from '../../../res/data/share.json'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import Utils from '../../util/Utils'
import ActionUtils from '../../util/ActionUtils'
import {FLAG_STORAGE} from '../../expand/dao/DataRepository'
import ViewUtils from '../../util/ViewUtils'
import RepositoryUtils from '../../expand/dao/RepositoryUtils'
export var FLAG_ABOUT = {flag_about: 'about', flag_about_me: 'about_me'}

export default class AboutCommon {
    constructor(props, updateState, flag_about, config) {
        this.props = props;
        this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
        this.updateState = updateState;
        this.flag_about = flag_about;
        this.config = config;
        this.favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
        this.repositories = [];
        this.repositoryUtils = new RepositoryUtils(this);
        this.favoriteKeys=null;
    }
    onBackPress(e){
        this.props.navigator.pop();
        return true;
    }
    componentDidMount() {
        this.backPress.componentDidMount();
        if (this.flag_about === FLAG_ABOUT.flag_about) {
            this.repositoryUtils.fetchRepository(this.config.info.currentRepoUrl);
        } else {
            var urls = [];
            var items=this.config.items;
            for (let i = 0, l =items.length; i < l; i++) {
                urls.push(this.config.info.url+items[i]);
            }
            this.repositoryUtils.fetchRepositories(urls);
        }
    }
    componentWillUnmount(){
        this.backPress.componentWillUnmount();
    }
    /**
     * 通知数据发生改变
     * @param items 改变的数据
     */
    onNotifyDataChanged(items) {
        this.updateFavorite(items);
    }

    /**
     * 更新项目的用户收藏状态
     * @param repositories
     */
    async updateFavorite(repositories) {
        if (repositories)this.repositories = repositories;
        if (!this.repositories)return;
        if(!this.favoriteKeys){
            this.favoriteKeys = await this.favoriteDao.getFavoriteKeys();
        }
        let projectModels = [];
        for (let i = 0, l = this.repositories.length; i < l; i++) {
            var data=this.repositories[i];
            var item=data.item?data.item:data;
            projectModels.push({
                isFavorite: Utils.checkFavorite(item, this.favoriteKeys?this.favoriteKeys:[]),
                item: item,
            })
        }
        this.updateState({
            projectModels: projectModels,
        })
    }

    /**
     * 创建项目视图
     * @param projectModels
     * @return {*}
     */
    renderRepository(projectModels) {
        if (!projectModels || projectModels.length === 0)return null;
        let views = [];
        for (let i = 0, l = projectModels.length; i < l; i++) {
            let projectModel = projectModels[i];
            views.push(
                <RepositoryCell
                    key={projectModel.item.id}
                    theme={this.props.theme}
                    onSelect={()=>ActionUtils.onSelectRepository({
                        projectModel:projectModel,
                        ...this.props,
                        flag:FLAG_STORAGE.flag_popular
                    })}
                    projectModel={projectModel}
                    onFavorite={(item, isFavorite)=>ActionUtils.onFavorite(this.favoriteDao,item, isFavorite,FLAG_STORAGE.flag_popular)}/>
            );
        }
        return views;
    }
    onShare(){
        var shareApp;
        if(this.flag_about===FLAG_ABOUT.flag_about_me){
            shareApp=share.share_app;
        }else {
            shareApp=share.share_blog;
        }
        UShare.share(shareApp.title, shareApp.content,
            shareApp.imgUrl,shareApp.url,()=>{},()=>{})
    }
    getParallaxRenderConfig(params) {
        let config = {};
        let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;
        config.renderBackground = () => (
            <View key="background">
                <Image source={{
                    uri: params.backgroundImg,
                    width: window.width,
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
                <View style={{
                    position: 'absolute',
                    top: 0,
                    width: window.width,
                    backgroundColor: 'rgba(0,0,0,.4)',
                    height: PARALLAX_HEADER_HEIGHT
                }}/>
            </View>
        );
        config.renderForeground = () => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={styles.avatar} source={avatar}/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        );
        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );
        config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtils.getLeftButton(()=>this.props.navigator.pop())}
                {ViewUtils.getShareButton(()=>this.onShare())}
            </View>
        );
        return config;
    }

    render(contentView, params) {
        let renderConfig = this.getParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
                contentBackgroundColor={GlobalStyles.backgroundColor}
                backgroundColor={this.props.theme.themeColor}
                headerBackgroundColor="#333"
                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                backgroundSpeed={10}
                {...renderConfig}
            >
                {contentView}
            </ParallaxScrollView>
        );
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? GlobalStyles.nav_bar_height_ios + 20 : GlobalStyles.nav_bar_height_android;

const styles = StyleSheet.create({
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        alignItems: 'center',
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        paddingRight: 8,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 60
    },
    avatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        marginBottom: 5,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 16,
        marginLeft: 10,
        marginRight: 10,
    },
});
