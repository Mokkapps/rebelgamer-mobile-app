<p>
  <a href="#badge">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square">
  </a>
</p>

# RebelGamer Mobile App

This repository contains the code of the iOS & Android app of the gaming blog [RebelGamer](https://www.rebelgamer.de).

It was developed using [React Native](https://facebook.github.io/react-native/) and uses the WordPress REST API to fetch the posts.

<img src="http://mokkapps.de/img/rebelgamer.png" width="250">

# App Store links

* [iOS](https://itunes.apple.com/de/app/rebelgamer-news-fur-gamer/id1187403828)
* [Android](https://play.google.com/store/apps/details?id=de.rebelgamer.RebelGamerRSS)

# Run locally on your development machine

```
$ git clone https://github.com/Mokkapps/rebelgamer-mobile-app
$ cd rebelgamer
$ npm install
$ npm start

$ npm android
or
$ npm ios
```

# Run iOS or Android release builds locally

```
$ npm android-release
or
$ npm ios-release
```

# Build releases for App stores

## iOS
* In Xcode open __RebelGamer.xcodeproj__ from ./ios folder 
* Select ```Product > Archive``` from menu bar

## Android
* Place your keystore in root folder
* Enter your keystore password in ./android/gradle.properties
* Run ```cd android && ./gradlew assembleRelease```

# Report a bug
Please create a [GitHub issue](https://github.com/MrMojo86/RebelGamer/issues)

# Using
* [React Native](https://facebook.github.io/react-native/)
* [React Navigation](https://reactnavigation.org/)
* [React Native Elements ](https://react-native-training.github.io/react-native-elements/)
* [React Native Vector Icons](https://github.com/oblador/react-native-vector-icons)
