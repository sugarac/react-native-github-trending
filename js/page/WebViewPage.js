/**
 * WebViewPage
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
import GlobalStyles from '../../res/styles/GlobalStyles'
import ViewUtils from '../util/ViewUtils'


export default class WebViewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            canGoBack: false,
            title: this.props.title,
        }
    }

    onBackPress(e) {
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

    render() {
        return (
            <View style={GlobalStyles.root_container}>
                <NavigationBar
                    navigator={this.props.navigator}
                    popEnabled={false}
                    style={{backgroundColor:'#2196F3'}}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBackPress())}
                    title={this.state.title}
                />
                <WebView
                    ref={webView=>this.webView=webView}
                    startInLoadingState={true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}/>
            </View>

        );
    }
}
