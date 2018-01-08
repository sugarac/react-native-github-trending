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
    Linking,
    TouchableOpacity,
} from 'react-native';
import {MORE_MENU} from '../../common/MoreMenu'
import WebViewPage from '../../page/WebViewPage'
import AboutMePage from './AboutMePage'
import GlobalStyles from '../../../res/styles/GlobalStyles'
import ViewUtils from '../../util/ViewUtils'
import AboutCommon,{FLAG_ABOUT}from './AboutCommon'
import config from '../../../res/data/config.json'

export default class AboutPage extends Component{
    constructor(props) {
        super(props);
        this.aboutCommon=new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about,config);
        this.state = {
            projectModels: [],
            author:config.author
        }
    }
    componentDidMount() {
        this.aboutCommon.componentDidMount();
    }
    componentWillUnmount(){
        this.aboutCommon.componentWillUnmount();
    }
    updateState(dic){
        this.setState(dic);
    }
    onClick(tab) {
        let TargetComponent, params = {...this.props,menuType:tab};
        switch (tab) {
            case MORE_MENU.About_Author:
                TargetComponent=AboutMePage;
                break;
            case MORE_MENU.Website:
                TargetComponent = WebViewPage;
                params.title='GitHubPopular';
                var url='http://www.devio.org/io/GitHubPopular/';
                params.url=url;
                break;
            case MORE_MENU.Feedback:
                var url='mailto://crazycodeboy@gmail.com';
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
            case MORE_MENU.Share:
                break;

        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }
    }
    render() {
        let content=<View>
            {this.aboutCommon.renderRepository(this.state.projectModels)}
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Website), require('../../../res/images/ic_computer.png'),MORE_MENU.Website, this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.About_Author), require('../my/img/ic_insert_emoticon.png'), MORE_MENU.About_Author, this.props.theme.styles.tabBarSelectedIcon)}
            <View style={GlobalStyles.line}/>
            {ViewUtils.getSettingItem(()=>this.onClick(MORE_MENU.Feedback), require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback,this.props.theme.styles.tabBarSelectedIcon)}
        </View>
        return this.aboutCommon.render(content, {
            'name': 'GitHub Popular',
            'description': '这是一个用来查看GitHub最受欢迎与最热项目的App,它基于React Native支持Android和iOS双平台。',
            'avatar':this.state.author.avatar1,
            'backgroundImg':this.state.author.backgroundImg1,
        });
    }
}


