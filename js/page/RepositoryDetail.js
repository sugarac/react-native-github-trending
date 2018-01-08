/**
 * RepositoryDetail
 * @flow
 **/
'use strict'
import React, {Component} from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    WebView,
    Platform,
    TouchableOpacity,
    Text,
    View,
} from 'react-native'
import NavigationBar from '../common/NavigationBar'
import ViewUtils from '../util/ViewUtils'
import share from '../../res/data/share.json'
import UShare from '../common/UShare'
import FavoriteDao from '../expand/dao/FavoriteDao'
import BackPressComponent from '../common/BackPressComponent'
const TRENDING_URL = 'https://github.com/'
export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        this.backPress=new BackPressComponent({backPress:(e)=>this.onBackPress(e)});
        this.url = this.props.projectModel.item.html_url ? this.props.projectModel.item.html_url
            : TRENDING_URL + this.props.projectModel.item.fullName;
        var title = this.props.projectModel.item.full_name ? this.props.projectModel.item.full_name
            : this.props.projectModel.item.fullName;
        this.favoriteDao = new FavoriteDao(this.props.flag);
        this.state = {
            url: this.url,
            canGoBack: false,
            title: title,
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png'),

        }
    }
    componentDidMount(){
        this.backPress.componentDidMount();
    }
    onBackPress(e){
        this.onBack();
        return true;
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount();
        if (this.props.onUpdateFavorite)this.props.onUpdateFavorite();
    }

    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        })
    }

    onRightButtonClick() {//favoriteIcon单击回调函数
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        var key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            this.props.navigator.pop();
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    renderRightButton() {
        return (<View style={{flexDirection: 'row'}}>
                {ViewUtils.getShareButton(()=>{
                    var shareApp=share.share_app;
                    UShare.share(shareApp.title, shareApp.content,
                        shareApp.imgUrl,shareApp.url,()=>{},()=>{})
                })}
                <TouchableOpacity
                    onPress={()=>this.onRightButtonClick()}>
                    <Image
                        style={{width: 20, height: 20, marginRight: 10}}
                        source={this.state.favoriteIcon}/>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        var titleLayoutStyle=this.state.title.length>20?{paddingRight:30}:null;
        return (
            <View style={styles.container}>
                <NavigationBar
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                    popEnabled={false}
                    title={this.state.title}
                    titleLayoutStyle={titleLayoutStyle}
                    style={this.props.theme.styles.navBar}
                    rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webView=>this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
})
