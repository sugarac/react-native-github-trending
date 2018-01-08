/**
 * 更多菜单
 * @flow
 */
'use strict';
import React, {Component, PropTypes} from 'react';

import {
    StyleSheet,
    Platform,
    TouchableOpacity,
    Image,
    Text,
    View,
    Linking,

} from 'react-native'
import CustomKeyPage from "../page/my/CustomKeyPage";
import SortKeyPagePage from "../page/my/SortKeyPagePage";
import Popover from '../common/Popover'
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import AboutPage from '../page/about/AboutPage'
import AboutMePage from '../page/about/AboutMePage'
import UShare from '../common/UShare'
import share from '../../res/data/share.json'
export const MORE_MENU = {
    Custom_Language: '自定义语言',
    Sort_Language: '语言排序',
    Custom_Theme: '自定义主题',
    Custom_Key: '自定义标签',
    Sort_Key: '标签排序',
    Remove_Key: '标签移除',
    About_Author: '关于作者',
    About: '关于',
    Website: 'Website',
    Feedback: '反馈',
    Share: '分享',
}
export default class MoreMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            buttonRect: {},
        }
    }

    static propTypes = {
        contentStyle: View.propTypes.style,
        menus: PropTypes.array.isRequired,
        anchorView: PropTypes.func,
    }

    /**
     * 打开更多菜单
     */
    open() {
        this.showPopover();
    }

    showPopover() {
        if (!this.props.anchorView)return;
        let anchorView = this.props.anchorView();
        anchorView.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({isVisible: false});
    }

    onMoreMenuSelect(tab) {
        this.closePopover();
        if(typeof(this.props.onMoreMenuSelect)=='function')this.props.onMoreMenuSelect(tab)
        let TargetComponent, params = {...this.props, menuType: tab};
        switch (tab) {
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.isRemoveKey=true;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPagePage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPagePage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Custom_Theme:

                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
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
                var shareApp=share.share_app;
                UShare.share(shareApp.title, shareApp.content,
                    shareApp.imgUrl,shareApp.url,()=>{},()=>{})
                break;
        }
        if (TargetComponent) {
            this.props.navigator.push({
                component: TargetComponent,
                params: params,
            });
        }

    }

    renderMoreView() {
        let view = <Popover
            isVisible={this.state.isVisible}
            fromRect={this.state.buttonRect}
            placement="bottom"
            contentMarginRight={20}
            onClose={()=>this.closePopover()}
            contentStyle={{opacity: 0.82, backgroundColor: '#343434'}}
            style={{backgroundColor: 'red'}}>
            <View style={{alignItems: 'center'}}>
                {this.props.menus.map((result, i, arr) => {
                    return <TouchableOpacity key={i} onPress={()=>this.onMoreMenuSelect(arr[i])}
                                             underlayColor='transparent'>
                        <Text
                            style={{fontSize: 18, color: 'white', padding: 8, fontWeight: '400'}}>
                            {arr[i]}
                        </Text>
                    </TouchableOpacity>
                })
                }
            </View>
        </Popover>
        return view;
    }

    render() {
        return this.renderMoreView();
    }
}
